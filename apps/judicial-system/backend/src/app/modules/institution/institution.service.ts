import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { Institution } from './institution.model'

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institution)
    private readonly institutionModel: typeof Institution,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getAll(): Promise<Institution[]> {
    this.logger.debug('Getting all institutions')

    return this.institutionModel.findAll({
      order: ['name'],
    })
  }
}
