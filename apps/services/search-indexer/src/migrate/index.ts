import yargs from 'yargs'

import { logger } from '@island.is/logging'
import { environment } from '../environments/environment'
import * as aws from './aws'
import * as dictionary from './dictionary'
import * as elastic from './elastic'
import * as kibana from './kibana'

interface PromiseStatus {
  success: boolean
  error?: Error
}

const { locales } = environment

class App {
  async run() {
    const versions = await Promise.all(
      locales.map((locale: string) =>
        elastic.getCurrentVersionFromConfig(locale),
      ),
    )
    if (!versions.every((version) => version === versions[0])) {
      logger.error('All of the index templates should have the same version')
      process.exit(1)
    }

    logger.info('Starting migration of dictionaries and ES config', environment)

    const hasAwsAccess = await aws.checkAWSAccess()

    let esPackages: aws.AwsEsPackage[]
    if (hasAwsAccess) {
      esPackages = await this.migrateAws()
    } else {
      logger.info('No aws access found running in local development mode')
      // get packageId list for local development packages have package ids matching filenames in the dictionary repo
      esPackages = dictionary.getFakeEsPackages()
    }

    await this.migrateES(esPackages)

    try {
      await this.migrateKibana()
    } catch (e) {
      logger.error('Failed migrating kibana', e)
    }

    // we remove unused AWS ES packages after ES migrate cause we cant/should not remove packages already in use
    if (hasAwsAccess) {
      logger.info('Cleaning up unused packages')
      // we want to disassociate and delete all packages below old index version, since other packages might be in use
      const dictionaryVersion = await dictionary.getDictionaryVersion()
      const oldDictionaryVersion = parseInt(dictionaryVersion) - 1
      await aws.disassociateUnusedPackagesFromAwsEs(oldDictionaryVersion)
      await aws.deleteUnusedPackagesFromAwsEs(oldDictionaryVersion)
    }
    logger.info('Done!')
  }

  private async migrateAws(): Promise<aws.AwsEsPackage[]> {
    logger.info('Starting aws migration')
    const repoDictionaryVersion = await dictionary.getDictionaryVersion()
    const awsDictionaryVersion = await aws.getDictionaryVersion()

    // we only try to update the dictionary files if we find a mismatch in version numbers
    if (repoDictionaryVersion !== awsDictionaryVersion) {
      logger.info('Dictionary version mismatch, updating dictionary', {
        repoVersion: repoDictionaryVersion,
        awsVersion: awsDictionaryVersion,
      })
      const dictionaries = await dictionary.getDictionaryFiles() // get files form dictionary repo
      const uploadedS3Files = await aws.updateS3DictionaryFiles(dictionaries) // upload repo files to s3
      const newEsPackages = await aws.createAwsEsPackages(
        uploadedS3Files,
        repoDictionaryVersion,
      ) // create packages for the new files in AWS ES
      await aws.associatePackagesWithAwsEs(newEsPackages) // attach the new packages to our AWS ES instance
      await aws.updateDictionaryVersion(repoDictionaryVersion) // update version file last to ensure process runs again on failure
    }

    // we get the associated packages from AWS ES and return them
    // this returns packages two versions back in time to support rollbacks
    const esPackages = await aws.getAllDomainEsPackages()

    /*
    we only want to return packages of current version
    else if dictionary is missing packages we might not see an error until old packages are deleted
    */
    const filteredAwsEsPackages = esPackages.filter((esPackage) => {
      const { version } = aws.parsePackageName(esPackage.packageName)
      return version === repoDictionaryVersion
    })

    logger.info('Aws migration completed')
    return filteredAwsEsPackages // es config needs the package ids when generating the index template
  }

  private async migrateES(
    esPackages: aws.AwsEsPackage[],
  ): Promise<elastic.MigrationInfo> {
    logger.info('Starting elasticsearch migration')
    await elastic.checkAccess() // this throws if there is no connection hence ensuring we dont continue
    const processedMigrations: elastic.MigrationInfo = {} // to rollback changes on failure
    const requests = locales.map(
      async (locale): Promise<PromiseStatus> => {
        const oldIndexVersion = await elastic.getCurrentVersionFromIndices(
          locale,
        )
        const newIndexVersion = await elastic.getCurrentVersionFromConfig(
          locale,
        )

        // old index version is used in aws cleanup so we allways set it
        processedMigrations[locale] = {
          oldIndexVersion,
        }

        if (oldIndexVersion !== newIndexVersion) {
          logger.info(
            'Elasticsearch index version does not match code index version, updating elasticsearch config',
            {
              locale,
              esIndexVersion: oldIndexVersion,
              codeIndexVersion: newIndexVersion,
            },
          )

          try {
            processedMigrations[
              locale
            ].oldTemplate = await elastic.getEsTemplate(locale)
            await elastic.updateIndexTemplate(locale, esPackages)
            await elastic.createNewIndexVersion(locale, newIndexVersion)
            processedMigrations[locale].newIndexVersion = newIndexVersion
            await elastic.importContentToIndex(locale, newIndexVersion, 'full')
            await elastic.moveAliasToNewIndex(
              locale,
              newIndexVersion,
              oldIndexVersion,
            ) // we assume we dont have to rollback on failure here
            await elastic.removeIndexesBelowVersion(locale, oldIndexVersion) // we keep the old index version as a backup
          } catch (error) {
            logger.error('Failed to migrate to new index', {
              locale,
              newIndexVersion,
              oldIndexVersion,
            })
            return {
              success: false, // pass this to promise all where we revert all changes if we have any false values (allSettled is not supported)
              error,
            }
          }
        } else {
          logger.info(
            'Elasticsearch index version matches code index version, no need to update index',
            {
              locale,
              esIndexVersion: oldIndexVersion,
              codeIndexVersion: newIndexVersion,
            },
          )
          logger.info('Initializing elastic data')
          // we send a initialize sync request to ensure all assets are up to date before this container runs
          await elastic.importContentToIndex(
            locale,
            oldIndexVersion,
            'initialize',
          )
        }
        return { success: true }
      },
    )

    try {
      // we wait for all promises to settle then we throw error if needed
      const results = await Promise.all(requests)
      results.forEach((result) => {
        if (!result.success) throw result.error
      })
    } catch (error) {
      logger.error(
        'Failed to migrate elasticsearch, rolling back to earlier version',
        error,
      )
      const locales = Object.keys(processedMigrations)
      const reverts = locales.map(async (locale) => {
        const { oldTemplate, newIndexVersion } = processedMigrations[locale]

        if (oldTemplate) {
          logger.info('Rolling back to earlier template', { locale })
          await elastic.updateEsTemplate(locale, oldTemplate)
        }

        if (newIndexVersion) {
          logger.info('Removing new index version', { locale })
          await elastic.removeIndexVersion(locale, newIndexVersion)
        }
      })
      await Promise.all(reverts)
      logger.info('Done rolling back to earlier version')
      throw error // we dont want this indexer to run if it could not migrate
    }

    // rank the search results so we can see if they change
    const currentIcelandicIndexVersion = await elastic.getCurrentVersionFromIndices(
      'is',
    )
    await elastic.rankSearchQueries('is', currentIcelandicIndexVersion)

    logger.info('Elasticsearch migration completed')
    return processedMigrations
  }

  private async migrateKibana() {
    logger.info('Starting kibana migration')
    const version = await elastic.getCurrentVersionFromConfig(locales[0])
    await kibana.importObjects(version)
    logger.info('Done')
  }

  async syncKibana() {
    logger.info('Starting kibana syncing')
    await kibana.syncObjects()
    logger.info('Done')
  }
}

async function migrateBootstrap() {
  const argv = yargs(process.argv).argv
  const app = new App()
  if (argv.syncKibana) {
    await app.syncKibana()
  } else {
    await app.run()
  }
}
// TODO: Add lock to this procedure to ensure only a single initContainer can run this

migrateBootstrap().catch((error) => {
  logger.error('ERROR: ', error)
  // take down container on error to prevent this search indexer from going live
  throw error
})
