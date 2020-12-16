import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { GrantType } from '../entities/models/grant-type.model'

@Injectable()
export class GrantTypeService {
  constructor(
    @InjectModel(GrantType)
    private grantTypeModel: typeof GrantType,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all Grant Types  */
  async findAll(): Promise<GrantType[] | null> {
    return this.grantTypeModel.findAll()
  }

  /** Get's all Grant Types and count */
  async findAndCountAll(
    page: number,
    count: number,
  ): Promise<{
    rows: GrantType[]
    count: number
  } | null> {
    page--
    const offset = page * count
    return this.grantTypeModel.findAndCountAll({
      limit: count,
      offset: offset,
    })
  }

  /** Get's a grant type by name */
  async getGrantType(name: string): Promise<GrantType | null> {
    this.logger.debug(`Finding grant type for name - "${name}"`)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.grantTypeModel.findByPk(name)
  }
}
