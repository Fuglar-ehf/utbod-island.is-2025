import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  ApplicationTypes,
  Application as BaseApplication,
} from '@island.is/application/types'
import {
  getApplicationTemplateByTypeId,
  getApplicationTranslationNamespaces,
} from '@island.is/application/template-loader'
import { IntlService } from '@island.is/cms-translations'
import { Locale } from '@island.is/shared/types'
import { getCurrentUser } from '@island.is/auth-nest-tools'

import { Application } from '@island.is/application/api/core'
import { ApplicationResponseDto } from '../dto/application.response.dto'
import { getCurrentLocale } from '../utils/currentLocale'
import isObject from 'lodash/isObject'

@Injectable()
export class ApplicationSerializer
  implements NestInterceptor<Application, Promise<unknown>> {
  constructor(private intlService: IntlService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<unknown>> {
    const user = getCurrentUser(context)
    const locale = getCurrentLocale(context)

    return next.handle().pipe(
      map(async (res: Application | Array<Application>) => {
        const isArray = Array.isArray(res)

        if (isArray) {
          return Promise.all(
            (res as Application[]).map((item) =>
              this.serialize(item, user.nationalId, locale),
            ),
          )
        }

        return this.serialize(res as Application, user.nationalId, locale)
      }),
    )
  }

  async serialize(model: Application, nationalId: string, locale: Locale) {
    const application = model.toJSON() as BaseApplication
    const template = await getApplicationTemplateByTypeId(
      application.typeId as ApplicationTypes,
    )
    const helper = new ApplicationTemplateHelper(application, template)
    const actionCardMeta = helper.getApplicationActionCardMeta()
    const namespaces = await getApplicationTranslationNamespaces(application)
    const intl = await this.intlService.useIntl(namespaces, locale)

    const userRole = template.mapUserToRole(nationalId, application) ?? ''

    const roleInState = helper.getRoleInState(userRole)
    const actors =
      application.applicant === nationalId ? application.applicantActors : []

    const getApplicationName = () => {
      if (typeof template.name === 'function') {
        const returnValue = template.name(application)
        if (
          isObject(returnValue) &&
          'value' in returnValue &&
          'name' in returnValue
        ) {
          return intl.formatMessage(returnValue.name, {
            value: returnValue.value,
          })
        }
        return intl.formatMessage(returnValue)
      }
      return intl.formatMessage(template.name)
    }

    const dto = plainToInstance(ApplicationResponseDto, {
      ...application,
      ...helper.getReadableAnswersAndExternalData(userRole),
      applicationActors: actors,
      actionCard: {
        title: actionCardMeta.title
          ? intl.formatMessage(actionCardMeta.title)
          : null,
        description: actionCardMeta.description
          ? intl.formatMessage(actionCardMeta.description)
          : null,
        tag: {
          variant: actionCardMeta.tag.variant || null,
          label: actionCardMeta.tag.label
            ? intl.formatMessage(actionCardMeta.tag.label)
            : null,
        },
        deleteButton: roleInState?.delete,
      },
      name: getApplicationName(),
      institution: template.institution
        ? intl.formatMessage(template.institution)
        : null,
      progress: helper.getApplicationProgress(),
    })
    return instanceToPlain(dto)
  }
}
