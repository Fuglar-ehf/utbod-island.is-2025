import { Op, literal } from 'sequelize'
import { Transaction } from 'sequelize/types'
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { CaseState, CaseType } from '@island.is/judicial-system/types'
import { MessageService, MessageType } from '@island.is/judicial-system/message'

import { User } from '../user'
import { CourtService } from '../court'
import { Case } from '../case/models/case.model'
import { CreateDefendantDto } from './dto/createDefendant.dto'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { DeliverResponse } from './models/deliver.response'
import { Defendant } from './models/defendant.model'

@Injectable()
export class DefendantService {
  constructor(
    @InjectModel(Defendant) private readonly defendantModel: typeof Defendant,
    private readonly courtService: CourtService,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    caseId: string,
    defendantToCreate: CreateDefendantDto,
    transaction?: Transaction,
  ): Promise<Defendant> {
    return transaction
      ? this.defendantModel.create(
          { ...defendantToCreate, caseId },
          { transaction },
        )
      : this.defendantModel.create({ ...defendantToCreate, caseId })
  }

  async update(
    caseId: string,
    defendantId: string,
    update: UpdateDefendantDto,
    transaction?: Transaction,
  ): Promise<Defendant> {
    const promisedUpdate = transaction
      ? this.defendantModel.update(update, {
          where: { id: defendantId, caseId },
          returning: true,
          transaction,
        })
      : this.defendantModel.update(update, {
          where: { id: defendantId, caseId },
          returning: true,
        })

    const [numberOfAffectedRows, defendants] = await promisedUpdate

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating defendant ${defendantId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update defendant ${defendantId} of case ${caseId}`,
      )
    }

    return defendants[0]
  }

  async delete(caseId: string, defendantId: string): Promise<boolean> {
    const numberOfAffectedRows = await this.defendantModel.destroy({
      where: { id: defendantId, caseId },
    })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting defendant ${defendantId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not delete defendant ${defendantId} of case ${caseId}`,
      )
    }

    return true
  }

  async isDefendantInActiveCustody(defendants?: Defendant[]): Promise<boolean> {
    if (
      !defendants ||
      !defendants[0]?.nationalId ||
      defendants[0]?.noNationalId
    ) {
      return false
    }

    const defendantsInCustody = await this.defendantModel.findAll({
      include: [
        {
          model: Case,
          as: 'case',
          where: {
            state: CaseState.ACCEPTED,
            type: CaseType.CUSTODY,
            valid_to_date: { [Op.gte]: literal('current_date') },
          },
        },
      ],
      where: { nationalId: defendants[0].nationalId },
    })

    return defendantsInCustody.some((d) => d.case)
  }

  async deliverDefendantToCourt(
    theCase: Case,
    defendant: Defendant,
    user: User,
  ): Promise<DeliverResponse> {
    if (
      defendant.noNationalId ||
      !defendant.nationalId ||
      defendant.nationalId.replace('-', '').length !== 10
    ) {
      // TODO: Uncomment when we are ready to send notifications
      // await this.messageService.sendMessageToQueue({
      //   type: MessageType.SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION,
      //   caseId: theCase.id,
      // })

      return { delivered: true }
    }

    return this.courtService
      .updateCaseWithDefendant(
        user,
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        defendant.nationalId.replace('-', ''),
        theCase.defenderEmail,
      )
      .then(() => {
        return { delivered: true }
      })
      .catch((reason) => {
        this.logger.error('failed to update case with defendant', { reason })

        return { delivered: false }
      })
  }
}
