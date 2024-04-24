import { InjectQueue, QueueService } from '@island.is/message-queue'
import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseInterceptors,
  Version,
} from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Documentation } from '@island.is/nest/swagger'

import { CreateNotificationDto } from './dto/createNotification.dto'
import { CreateNotificationResponse } from './dto/createNotification.response'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { HnippTemplate } from './dto/hnippTemplate.response'
import { NotificationsService } from './notifications.service'
import type { Locale } from '@island.is/shared/types'

@Controller('notifications')
@ApiTags('notifications')
@ApiExtraModels(CreateNotificationDto)
@UseInterceptors(CacheInterceptor)
export class NotificationsController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly notificationsService: NotificationsService,
    @InjectQueue('notifications') private queue: QueueService,
  ) {}

  @Documentation({
    summary: 'Fetches all notification templates',
    includeNoContentResponse: true,
    response: { status: 200, type: [HnippTemplate] },
    request: {
      query: {
        locale: {
          required: false,
          type: 'string',
          description: 'locale',
          example: 'en',
        },
      },
    },
  })
  @Get('/templates')
  @Version('1')
  async getNotificationTemplates(
    @Query('locale') locale?: Locale,
  ): Promise<HnippTemplate[]> {
    this.logger.info(`Fetching hnipp templates for locale: ${locale}`)
    return await this.notificationsService.getTemplates(locale)
  }

  @Documentation({
    summary: 'Fetches a single notification template',
    includeNoContentResponse: true,
    response: { status: 200, type: HnippTemplate },
    request: {
      params: {
        templateId: {
          type: 'string',
          description: 'ID of the template',
          example: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
        },
      },
      query: {
        locale: {
          required: false,
          type: 'string',
          description: 'locale',
          example: 'en',
        },
      },
    },
  })
  @Get('/template/:templateId')
  @Version('1')
  async getNotificationTemplate(
    @Param('templateId')
    templateId: string,
    @Query('locale') locale: Locale,
  ): Promise<HnippTemplate> {
    return await this.notificationsService.getTemplate(templateId, locale)
  }

  @Documentation({
    summary: 'Creates a new notification and adds to queue',
    includeNoContentResponse: true,
    response: { status: 201, type: CreateNotificationResponse },
  })
  @Post('/')
  @Version('1')
  async createHnippNotification(
    @Body() body: CreateHnippNotificationDto,
  ): Promise<CreateNotificationResponse> {
    await this.notificationsService.validate(body.templateId, body.args)
    const id = await this.queue.add(body)
    const flattenedArgs: Record<string, string> = {}
    for (const arg of body.args) {
      flattenedArgs[arg.key] = arg.value
    }
    this.logger.info('Message queued', {
      messageId: id,
      ...flattenedArgs,
      ...body,
    })

    return {
      id,
    }
  }
}
