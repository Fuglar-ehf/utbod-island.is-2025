import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { Case, CaseExistsGuard, CaseWriteGuard, CurrentCase } from '../case'
import { SendNotificationDto } from './dto/sendNotification.dto'
import {
  courtOfAppealsAssistantNotificationRule,
  courtOfAppealsJudgeNotificationRule,
  courtOfAppealsRegistrarNotificationRule,
  defenderNotificationRule,
  districtCourtAssistantNotificationRule,
  districtCourtJudgeNotificationRule,
  districtCourtRegistrarNotificationRule,
  prosecutorNotificationRule,
} from './guards/rolesRules'
import { SendNotificationResponse } from './models/sendNotification.response'
import { NotificationService } from './notification.service'

@UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard)
@Controller('api/case/:caseId/notification')
@ApiTags('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseWriteGuard)
  @RolesRules(
    prosecutorNotificationRule,
    districtCourtJudgeNotificationRule,
    districtCourtRegistrarNotificationRule,
    districtCourtAssistantNotificationRule,
    courtOfAppealsJudgeNotificationRule,
    courtOfAppealsRegistrarNotificationRule,
    courtOfAppealsAssistantNotificationRule,
    defenderNotificationRule,
  )
  @Post()
  @ApiCreatedResponse({
    type: SendNotificationResponse,
    description: 'Adds a new notification for an existing case to queue',
  })
  async sendCaseNotification(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() notification: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    this.logger.debug(
      `Adding ${notification.type} notification for case ${caseId} to queue`,
    )

    return this.notificationService.addMessagesForNotificationToQueue(
      notification,
      theCase,
      user,
    )
  }
}
