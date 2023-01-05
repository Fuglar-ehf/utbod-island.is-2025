import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NotificationType } from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
  assistantRule,
} from '../../guards'
import {
  Case,
  CaseExistsGuard,
  CaseReadGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { SendNotificationDto } from './dto/sendNotification.dto'
import { Notification } from './models/notification.model'
import { SendNotificationResponse } from './models/sendNotification.response'
import { NotificationService } from './notification.service'
import {
  judgeNotificationRule,
  prosecutorNotificationRule,
  registrarNotificationRule,
  representativeNotificationRule,
  assistantNotificationRule,
} from './guards/rolesRules'

@UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard)
@Controller('api/case/:caseId')
@ApiTags('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseWriteGuard)
  @RolesRules(
    prosecutorNotificationRule,
    representativeNotificationRule,
    judgeNotificationRule,
    registrarNotificationRule,
    assistantNotificationRule,
  )
  @Post('notification')
  @ApiCreatedResponse({
    type: SendNotificationResponse,
    description: 'Sends a new notification for an existing case',
  })
  async sendCaseNotification(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() notification: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    this.logger.debug(
      `Sending ${notification.type} notification for case ${caseId}`,
    )

    if (notification.type === NotificationType.HEADS_UP) {
      return this.notificationService
        .addMessagesForHeadsUpNotificationToQueue(theCase)
        .then(() => ({ notificationSent: true }))
        .catch(() => ({ notificationSent: false }))
    }

    return this.notificationService.sendCaseNotification(
      notification,
      theCase,
      user,
    )
  }

  @UseGuards(CaseReadGuard)
  @RolesRules(
    prosecutorRule,
    representativeRule,
    judgeRule,
    registrarRule,
    assistantRule,
  )
  @Get('notifications')
  @ApiOkResponse({
    type: Notification,
    isArray: true,
    description: 'Gets all existing notifications for an existing case',
  })
  async getAllCaseNotifications(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<Notification[]> {
    this.logger.debug(`Getting all notifications for case ${caseId}`)

    return this.notificationService.getAllCaseNotifications(theCase)
  }
}
