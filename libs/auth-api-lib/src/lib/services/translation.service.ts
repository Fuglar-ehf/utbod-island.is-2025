import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Sequelize } from 'sequelize-typescript'
import { Translation } from '../entities/models/translation.model'
import { Language } from '../entities/models/language.model'
import { TranslationDTO } from '../entities/dto/translation.dto'
import { LanguageDTO } from '../entities/dto/language.dto'
import { Op } from 'sequelize'

@Injectable()
export class TranslationService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Translation)
    private translationModel: typeof Translation,
    @InjectModel(Language)
    private langugeModel: typeof Language,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's and counts all translations */
  async findAndCountAllTranslations(
    page: number,
    count: number,
  ): Promise<{
    rows: Translation[]
    count: number
  } | null> {
    page--
    const offset = page * count
    return this.translationModel.findAndCountAll({
      limit: count,
      offset: offset,
      distinct: true,
    })
  }

  /** Find clients by searh string and returns with paging */
  async findTranslations(searchString: string, page: number, count: number) {
    if (!searchString) {
      throw new BadRequestException('Search String must be provided')
    }
    page--
    const offset = page * count
    searchString = searchString.trim()

    return this.translationModel.findAndCountAll({
      where: {
        value: { [Op.like]: searchString },
      },
      limit: count,
      offset: offset,
      distinct: true,
    })
  }

  /** Get's all translations */
  async findAllTranslations(): Promise<Translation[] | null> {
    return this.translationModel.findAll()
  }

  /** Get's all languages */
  async findAllLanguages(): Promise<Language[] | null> {
    return this.langugeModel.findAll()
  }

  /** Get's and counts all languages */
  async findAndCountAllLanguages(
    page: number,
    count: number,
  ): Promise<{
    rows: Language[]
    count: number
  } | null> {
    page--
    const offset = page * count
    return this.langugeModel.findAndCountAll({
      limit: count,
      offset: offset,
      distinct: true,
    })
  }

  /** Adds a new Language */
  async createLanguage(language: LanguageDTO): Promise<Language | undefined> {
    try {
      return this.sequelize.transaction((t) => {
        return this.langugeModel.create(language)
      })
    } catch {
      this.logger.warn('Error when executing transaction, rollbacked.')
    }
  }

  /** Updates an existing Language */
  async updateLanguage(language: LanguageDTO): Promise<Language | null> {
    this.logger.debug(`Updating language: ${language.isoKey}`)

    await this.langugeModel.update(language, {
      where: { isoKey: language.isoKey },
    })

    return this.findLanguage(language.isoKey)
  }

  /** Deletes a language */
  async deleteLanguage(isoKey: string): Promise<number | null> {
    this.logger.debug(`Deleting language: ${isoKey}`)

    return this.langugeModel.destroy({ where: { isoKey: isoKey } })
  }

  /** Finds a translation by it's key */
  async findTranslation(
    language: string,
    className: string,
    property: string,
    key: string,
  ): Promise<Translation | null> {
    return this.translationModel.findOne({
      where: {
        language: language,
        className: className,
        key: key,
        property: property,
      },
    })
  }

  /** Creates a new Translation */
  async createTranslation(
    translation: TranslationDTO,
  ): Promise<Translation | undefined> {
    this.logger.debug(`Creating translation for id - ${translation.key}`)
    try {
      return this.sequelize.transaction((t) => {
        return this.translationModel.create(translation)
      })
    } catch {
      this.logger.warn('Error when executing transaction, rollbacked.')
    }
  }

  async findLanguage(isoKey: string): Promise<Language | null> {
    return this.langugeModel.findByPk(isoKey)
  }

  /** Updates an existing translation */
  async updateTranslation(
    translate: TranslationDTO,
  ): Promise<Translation | null> {
    this.logger.debug('Updating the translation with key: ', translate.key)

    await this.translationModel.update(
      { ...translate },
      {
        where: {
          language: translate.language,
          className: translate.className,
          key: translate.key,
          property: translate.property,
        },
      },
    )

    return this.findTranslation(
      translate.language,
      translate.className,
      translate.property,
      translate.key,
    )
  }

  /** Deletes a translation */
  async deleteTranslation(translate: TranslationDTO): Promise<number | null> {
    this.logger.debug(`Deleting translation with key: ${translate.key}`)

    if (!translate) {
      throw new BadRequestException('translate object must be provided')
    }

    return await this.translationModel.destroy({
      where: {
        language: translate.language,
        className: translate.className,
        key: translate.key,
        property: translate.property,
      },
    })
  }
}
