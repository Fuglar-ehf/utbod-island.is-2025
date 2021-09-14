import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApplicationEventModel } from './models'

import { CreateApplicationEventDto } from './dto'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class ApplicationEventService {
  constructor(
    @InjectModel(ApplicationEventModel)
    private readonly applicationEventModel: typeof ApplicationEventModel,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getAll(): Promise<ApplicationEventModel[]> {
    this.logger.debug('Getting all application events')
    return this.applicationEventModel.findAll()
  }

  async findById(id: string): Promise<ApplicationEventModel[]> {
    this.logger.debug('Finding application event by id')
    return this.applicationEventModel.findAll({
      where: {
        applicationId: id,
      },
      order: [['created', 'DESC']],
    })
  }

  async create(
    applicationEvent: CreateApplicationEventDto,
  ): Promise<ApplicationEventModel> {
    this.logger.debug('Creating a new application event')
    return this.applicationEventModel.create(applicationEvent)
  }
}
