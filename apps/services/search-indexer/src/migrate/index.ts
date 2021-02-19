import yargs from 'yargs'
import { logger } from '@island.is/logging'
import { environment } from '../environments/environment'
import * as aws from './aws'
import * as dictionary from './dictionary'
import * as elastic from './elastic'
import * as kibana from './kibana'
import * as indexManager from '@island.is/content-search-index-manager'

const { locales } = environment

class App {
  async run() {
    logger.info('Starting migration of dictionaries and ES config', environment)

    const hasAwsAccess = await aws.checkAWSAccess()

    if (hasAwsAccess) {
      await this.migrateAws()
    }

    await this.migrateES(hasAwsAccess)

    try {
      await this.migrateKibana()
    } catch (e) {
      logger.error('Failed migrating kibana', e)
    }

    logger.info('Done!')
  }

  private async migrateAws(): Promise<boolean> {
    logger.info('Starting aws migration')

    const dictionaryVersion = indexManager.getDictionaryVersion() // returns versions of the dictionary in order with the newest version first

    logger.info('Requesting files for dictionary version', {
      version: dictionaryVersion,
    })

    const versionsDictionaryFiles = await dictionary.getDictionaryFilesForVersion(
      dictionaryVersion,
    )

    // we will always validate packages against (s3 -> AWS ES -> AWS ES search domain) to ensure we don't have partial updates
    logger.info('Starting validation of S3 and AWS packages')
    const s3Files = await aws.uploadS3DictionaryFiles(versionsDictionaryFiles) // upload repo files to s3
    const newEsPackages = await aws.createAwsEsPackages(s3Files) // create the dictionary packages files in AWS ES
    await aws.associatePackagesWithAwsEsSearchDomain(newEsPackages) // attach the new packages to our AWS ES search domain
    logger.info('All S3 and AWS packages up to date, AWS migration complete')
    return true
  }

  private async migrateES(hasAwsAccess: boolean): Promise<boolean> {
    logger.info('Starting elasticsearch migration')

    // get dictionary AWS ES packages
    let esPackages: aws.AwsEsPackage[]
    if (hasAwsAccess) {
      // get all packages for this version associated to the AWS ES search domain
      const dictionaryVersion = indexManager.getDictionaryVersion()
      esPackages = await aws.getAssociatedEsPackages(dictionaryVersion)

      // we should always have some packages here
      if (!esPackages.length) {
        new Error(
          `Failed to get dictionary packages from AWS ES search domain for the given version: ${dictionaryVersion}`,
        )
      }
    } else {
      logger.info('No aws access found running in local development mode')
      /*
      get packageId list for local development
      packages have package ids matching filenames in the dictionary repo
      this references local package names shipped with our development ES cluster
      */
      esPackages = dictionary.getFakeEsPackages()
    }

    logger.log('Found es packages', { esPackages })

    await elastic.checkAccess() // this throws if there is no connection hence ensuring we don't continue

    const results = await Promise.all(
      locales.map(
        async (locale): Promise<true | Error> => {
          const newIndexName = indexManager.getElasticsearchIndex(locale)
          const newIndexExists = await elastic.checkIfIndexExists(newIndexName)

          if (!newIndexExists) {
            logger.info('New index not found, updating elasticsearch config', {
              locale,
              newIndexName,
            })

            try {
              await elastic.updateIndexTemplate(locale, esPackages)
              logger.info('updated template', { newIndexName })
              await elastic.importContentToIndex(locale, newIndexName, 'full')
            } catch (error) {
              logger.error('Failed to migrate to new index', {
                locale,
                newIndexName,
                error: error.message,
              })
              // remove the index to make migration run again for this index
              await elastic.removeIndexIfExists(newIndexName)
              // resolve the promise instead of throw to let migrations for other indices finish
              return error
            }
          } else {
            logger.info(
              'Elasticsearch index version matches code index version, skipping index update',
              {
                locale,
                newIndexName,
              },
            )
            logger.info('Initializing elastic data')
            // index mappers might have new rules so we run a initialize sync to make sure all data is up to date with this new version
            await elastic.importContentToIndex(
              locale,
              newIndexName,
              'initialize',
            )
          }
          return true
        },
      ),
    )

    // make sure we throw an error to stop deployment of this version if any index migration is faulty
    results.forEach((result) => {
      if (result !== true) {
        logger.error(
          'Failed to migrate all indices, terminating process to prevent deployment of faulty indices',
          {
            error: result.message,
          },
        )
        throw result
      }
    })

    // rank the search results so we can see if they change
    await elastic.rankSearchQueries(indexManager.getElasticsearchIndex('is'))

    logger.info('Elasticsearch migration completed')
    return true
  }

  private async migrateKibana() {
    logger.info('Starting kibana migration')
    const version = indexManager.getElasticVersion()
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

migrateBootstrap().catch((error) => {
  logger.error('ERROR: ', error)
  // take down container on error to prevent this search indexer from going live
  throw error
})
