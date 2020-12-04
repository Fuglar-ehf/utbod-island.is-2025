import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Claim } from '../entities/models/claim.model'
import { Sequelize } from 'sequelize-typescript'
import { UserIdentity } from '../entities/models/user-identity.model'
import { UserIdentityDto } from '../entities/dto/user-identity.dto'

@Injectable()
export class UserIdentitiesService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(UserIdentity)
    private userIdentityModel: typeof UserIdentity,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all user identities and total count of rows */
  async findAndCountAll(): Promise<{
    rows: UserIdentity[]
    count: number
  } | null> {
    return this.userIdentityModel.findAndCountAll({
      include: [Claim],
      distinct: true,
    })
  }

  /** Creates a new User Identity */
  async create(
    userIdentity: UserIdentityDto,
  ): Promise<UserIdentity | undefined> {
    this.logger.debug(
      `Creating user identity with subjectId - ${userIdentity.subjectId}`,
    )

    try {
      return this.sequelize.transaction((t) => {
        return this.userIdentityModel.create(userIdentity, {
          include: [Claim],
          transaction: t,
        })
      })
    } catch {
      this.logger.warn('Error when executing transaction, rollbacked.')
    }
  }

  /** Gets a user identity by subjectId */
  async findBySubjectId(subjectId: string): Promise<UserIdentity | null> {
    this.logger.debug(`Finding user identity for subjectId - "${subjectId}"`)

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    return await this.userIdentityModel.findByPk(subjectId, {
      include: [Claim],
    })
  }

  /** Get user identity by national national id (kt) */
  async findByNationalId(nationalId: string) {
    if (!nationalId) {
      throw new BadRequestException('NationalId must be provided')
    }

    const linkedIdentity = await this.userIdentityModel.findAll({
      include: [
        {
          model: Claim,
          where: { type: 'nationalId', value: nationalId },
        },
      ],
    })

    if (linkedIdentity) {
      return linkedIdentity
    }

    return null
  }

  /** Gets a user identiy by a provider and subjectid */
  async findByProviderSubjectId(
    provider: string,
    subjectId: string,
  ): Promise<UserIdentity | null> {
    this.logger.debug(
      `Finding user identity for provider "${provider}" and subjectId - "${subjectId}"`,
    )

    if (!provider) {
      throw new BadRequestException('Provider must be provided')
    }

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    return this.userIdentityModel.findOne({
      where: { providerName: provider, providerSubjectId: subjectId },
      include: [Claim],
    })
  }

  /** Updates an existing user identity */
  async update(userIdentity: UserIdentityDto): Promise<UserIdentity | null> {
    this.logger.debug(
      'Updating the user identity with subjectId: ',
      userIdentity.subjectId,
    )

    await this.userIdentityModel.update(
      { ...userIdentity },
      {
        where: { subjectId: userIdentity.subjectId },
      },
    )

    return await this.findBySubjectId(userIdentity.subjectId)
  }

  /** Deletes an user identity by subjectid */
  async delete(subjectId: string): Promise<number> {
    this.logger.debug('Deleting user identity with subjectId: ', subjectId)

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    return await this.userIdentityModel.destroy({
      where: { subjectId: subjectId },
    })
  }

  /** Activates or deactivates a user by it's subjectId */
  async setActive(
    subjectId: string,
    active: boolean,
  ): Promise<UserIdentity | null> {
    this.logger.debug(`Set subjectId: ${subjectId} as active: ${active}`)

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    const sub = await this.userIdentityModel.findByPk(subjectId)
    sub.active = active
    return sub.save()
  }
}
