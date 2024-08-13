import { Injectable } from '@nestjs/common'
import { Form } from '../../forms/models/form.model'
import { ApplicationDto } from './dto/application.dto'
import { Application } from './application.model'
import { OrganizationDto } from '../../organizations/models/dto/organization.dto'
import { ApplicationSectionDto } from '../../sections/models/dto/applicationSection.dto'
import { ApplicationScreenDto } from '../../screens/models/dto/applicationScreen.dto'
import { ApplicationFieldDto } from '../../fields/models/dto/applicationField.dto'
import { FieldSettingsMapper } from '../../fieldSettings/models/fieldSettings.mapper'

@Injectable()
export class ApplicationMapper {
  constructor(private readonly fieldSettingsMapper: FieldSettingsMapper) {}
  mapFormToApplicationDto(
    form: Form,
    application: Application,
  ): ApplicationDto {
    const applicationDto: ApplicationDto = {
      applicationId: application.id,
      formId: form.id,
      slug: form.slug,
      organization: new OrganizationDto(),
      sections: [],
    }

    form.sections?.map((section) => {
      applicationDto.sections?.push({
        id: section.id,
        name: section.name,
        sectionType: section.sectionType,
        displayOrder: section.displayOrder,
        waitingText: section.waitingText,
        screens: section.screens?.map((screen) => {
          return {
            id: screen.id,
            sectionId: screen.sectionId,
            name: screen.name,
            displayOrder: screen.displayOrder,
            multiset: screen.multiset,
            callRuleset: screen.callRuleset,
            fields: screen.fields?.map((field) => {
              return {
                id: field.id,
                screenId: field.screenId,
                name: field.name,
                displayOrder: field.displayOrder,
                description: field.description,
                isPartOfMultiset: field.isPartOfMultiset,
                fieldType: field.fieldType,
                fieldSettings:
                  this.fieldSettingsMapper.mapFieldTypeToFieldSettingsDto(
                    field.fieldSettings,
                    field.fieldType,
                  ),
              } as ApplicationFieldDto
            }),
          } as ApplicationScreenDto
        }),
      } as ApplicationSectionDto)
    })

    return applicationDto
  }
}
