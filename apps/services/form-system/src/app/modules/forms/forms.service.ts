import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

import { SectionTypes } from '../../enums/sectionTypes'
import { FormApplicantDto } from '../applicants/models/dto/formApplicant.dto'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { Screen } from '../screens/models/screen.model'
import { FieldSettingsMapper } from '../fieldSettings/models/fieldSettings.mapper'
import { FieldSettings } from '../fieldSettings/models/fieldSettings.model'
import { FieldDto } from '../fields/models/dto/field.dto'
import { FieldTypeDto } from '../fields/models/dto/fieldType.dto'
import { Field } from '../fields/models/field.model'
import { FieldType } from '../fields/models/fieldType.model'
import { ListTypeDto } from '../lists/models/dto/listType.dto'
import { ListType } from '../lists/models/listType.model'
import { Organization } from '../organizations/models/organization.model'
import { SectionDto } from '../sections/models/dto/section.dto'
import { Section } from '../sections/models/section.model'
import { FormCertificationTypeDto } from '../certifications/models/dto/formCertificationType.dto'
import { CertificationTypeDto } from '../certifications/models/dto/certificationType.dto'
import { CertificationType } from '../certifications/models/certificationType.model'
import { CreateFormDto } from './models/dto/createForm.dto'
import { FormDto } from './models/dto/form.dto'
import { FormResponse } from './models/dto/form.response.dto'
import { Form } from './models/form.model'
import { ListItem } from '../listItems/models/listItem.model'
import { FormsListDto } from './models/dto/formsList.dto'
import { FormsListFormDto } from './models/dto/formsListForm.dto'
import { createFormTranslations } from '../translations/form'
import { createSectionTranslations } from '../translations/section'

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
    @InjectModel(Screen)
    private readonly screenModel: typeof Screen,
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
    @InjectModel(FieldType)
    private readonly fieldTypeModel: typeof FieldType,
    @InjectModel(ListType)
    private readonly listTypeModel: typeof ListType,
    private readonly fieldSettingsMapper: FieldSettingsMapper,
  ) {}

  async findAll(organizationId: string): Promise<FormsListDto> {
    const forms = await this.formModel.findAll({
      where: { organizationId: organizationId },
    })

    const keys = [
      'id',
      'name',
      'slug',
      'invalidationDate',
      'created',
      'modified',
      'isTranslated',
      'applicationDaysToRemove',
      'stopProgressOnValidatingScreen',
    ]

    const formsListDto: FormsListDto = {
      forms: forms.map((form) => {
        return defaults(
          pick(form, keys),
          zipObject(keys, Array(keys.length).fill(null)),
        ) as FormsListFormDto
      }),
    }

    return formsListDto
  }

  async findOne(id: string): Promise<FormResponse | null> {
    const form = await this.findById(id)

    if (!form) {
      return null
    }
    const formResponse = await this.buildFormResponse(form)

    return formResponse
  }

  async create(createFormDto: CreateFormDto): Promise<FormResponse | null> {
    const { organizationId } = createFormDto

    if (!organizationId) {
      throw new Error('Missing organizationId')
    }

    const organization = this.organizationModel.findByPk(organizationId)
    if (!organization) {
      throw new NotFoundException(
        `Organization with id ${organizationId} not found`,
      )
    }

    const newForm: Form = await this.formModel.create({
      organizationId: organizationId,
    } as Form)

    await this.createFormTemplate(newForm)

    const form = await this.findById(newForm.id)

    const formResponse = await this.buildFormResponse(form)

    return formResponse
  }

  async delete(id: string): Promise<void> {
    const form = await this.findById(id)
    form?.destroy()
  }

  private async findById(id: string): Promise<Form> {
    const form = await this.formModel.findByPk(id, {
      include: [
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Screen,
              as: 'screens',
              include: [
                {
                  model: Field,
                  as: 'fields',
                  include: [
                    {
                      model: FieldSettings,
                      as: 'fieldSettings',
                      include: [
                        {
                          model: ListItem,
                          as: 'list',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    return form
  }

  private async buildFormResponse(form: Form): Promise<FormResponse> {
    const response: FormResponse = {
      form: this.setArrays(form),
      fieldTypes: await this.getFieldTypes(form.organizationId),
      certificationTypes: await this.getCertificationTypes(form.organizationId),
      listTypes: await this.getListTypes(form.organizationId),
    }

    return response
  }

  private async getCertificationTypes(
    organizationId: string,
  ): Promise<CertificationTypeDto[]> {
    const organizationSpecificCertificationTypes =
      await this.organizationModel.findByPk(organizationId, {
        include: [CertificationType],
      })

    const organizationCertificationTypes =
      organizationSpecificCertificationTypes?.organizationCertificationTypes as CertificationType[]

    const certificationTypesDto: CertificationTypeDto[] = []

    const keys = ['id', 'type', 'name', 'description']
    organizationCertificationTypes?.map((certificationType) => {
      certificationTypesDto.push(
        defaults(
          pick(certificationType, keys),
          zipObject(keys, Array(keys.length).fill(null)),
        ) as CertificationTypeDto,
      )
    })

    return certificationTypesDto
  }

  private async getFieldTypes(organizationId: string): Promise<FieldTypeDto[]> {
    const commonFieldTypes = await this.fieldTypeModel.findAll({
      where: { isCommon: true },
    })
    const organizationSpecificFieldTypes =
      await this.organizationModel.findByPk(organizationId, {
        include: [FieldType],
      })

    const organizationFieldTypes = commonFieldTypes.concat(
      organizationSpecificFieldTypes?.organizationFieldTypes as FieldType[],
    )

    const fieldTypesDto: FieldTypeDto[] = []
    const keys = ['id', 'type', 'name', 'description', 'isCommon']
    organizationFieldTypes.map((fieldType) => {
      fieldTypesDto.push(
        Object.assign(
          defaults(
            pick(fieldType, keys),
            zipObject(keys, Array(keys.length).fill(null)),
          ),
          {
            fieldSettings:
              this.fieldSettingsMapper.mapFieldTypeToFieldSettingsDto(
                null,
                fieldType.type,
              ),
          },
        ) as FieldTypeDto,
      )
    })

    return fieldTypesDto
  }

  private async getListTypes(organizationId: string): Promise<ListTypeDto[]> {
    const commonListTypes = await this.listTypeModel.findAll({
      where: { isCommon: true },
    })
    const organizationSpecificListTypes = await this.organizationModel.findByPk(
      organizationId,
      { include: [ListType] },
    )

    const organizationListTypes = commonListTypes.concat(
      organizationSpecificListTypes?.organizationListTypes as ListType[],
    )

    const listTypesDto: ListTypeDto[] = []
    const keys = ['id', 'type', 'name', 'description', 'isCommon']
    organizationListTypes.map((listType) => {
      listTypesDto.push(
        defaults(
          pick(listType, keys),
          zipObject(keys, Array(keys.length).fill(null)),
        ) as ListTypeDto,
      )
    })

    return listTypesDto
  }

  private setArrays(form: Form): FormDto {
    const formKeys = [
      'id',
      'organizationId',
      'name',
      'slug',
      'invalidationDate',
      'created',
      'modified',
      'isTranslated',
      'applicationDaysToRemove',
      'stopProgressOnValidatingScreen',
      'completedMessage',
    ]
    const formDto: FormDto = Object.assign(
      defaults(
        pick(form, formKeys),
        zipObject(formKeys, Array(formKeys.length).fill(null)),
      ),
      {
        certificationTypes: [],
        applicants: [],
        sections: [],
        screens: [],
        fields: [],
      },
    ) as FormDto

    const formCertificationTypeKeys = ['id', 'name', 'description', 'type']
    form.certificationTypes?.map((certificationType) => {
      formDto.certificationTypes?.push(
        defaults(
          pick(certificationType, formCertificationTypeKeys),
          zipObject(
            formCertificationTypeKeys,
            Array(formCertificationTypeKeys.length).fill(null),
          ),
        ) as FormCertificationTypeDto,
      )
    })

    const applicantKeys = ['id', 'applicantType', 'name']
    form.applicants?.map((applicant) => {
      formDto.applicants?.push(
        defaults(
          pick(applicant, applicantKeys),
          zipObject(applicantKeys, Array(applicantKeys.length).fill(null)),
        ) as FormApplicantDto,
      )
    })

    const sectionKeys = [
      'id',
      'name',
      'created',
      'modified',
      'sectionType',
      'displayOrder',
      'waitingText',
      'isHidden',
      'isCompleted',
    ]
    const screenKeys = [
      'id',
      'sectionId',
      'name',
      'created',
      'modified',
      'displayOrder',
      'isHidden',
      'multiset',
      'callRuleset',
    ]
    const fieldKeys = [
      'id',
      'screenId',
      'name',
      'created',
      'modified',
      'displayOrder',
      'description',
      'isHidden',
      'isPartOfMultiset',
      'fieldType',
    ]
    form.sections.map((section) => {
      formDto.sections?.push(
        defaults(
          pick(section, sectionKeys),
          zipObject(sectionKeys, Array(sectionKeys.length).fill(null)),
        ) as SectionDto,
      )
      section.screens?.map((screen) => {
        formDto.screens?.push(
          defaults(
            pick(screen, screenKeys),
            zipObject(screenKeys, Array(screenKeys.length).fill(null)),
          ) as ScreenDto,
        )
        screen.fields?.map((field) => {
          formDto.fields?.push(
            Object.assign(
              defaults(
                pick(field, fieldKeys),
                zipObject(fieldKeys, Array(fieldKeys.length).fill(null)),
              ),
              {
                fieldSettings:
                  this.fieldSettingsMapper.mapFieldTypeToFieldSettingsDto(
                    field.fieldSettings,
                    field.fieldType,
                  ),
              },
            ) as FieldDto,
          )
        })
      })
    })

    return formDto
  }

  private async createFormTemplate(form: Form): Promise<void> {
    await this.sectionModel.bulkCreate([
      {
        formId: form.id,
        sectionType: SectionTypes.PREMISES,
        displayOrder: 0,
        name: createFormTranslations.premise,
      } as Section,
      {
        formId: form.id,
        sectionType: SectionTypes.PARTIES,
        displayOrder: 1,
        name: createFormTranslations.parties,
      } as Section,
      {
        formId: form.id,
        sectionType: SectionTypes.PAYMENT,
        displayOrder: 3,
        name: createFormTranslations.payment,
      } as Section,
    ])

    const inputSection = await this.sectionModel.create({
      formId: form.id,
      sectionType: SectionTypes.INPUT,
      displayOrder: 2,
      name: createSectionTranslations.input,
    } as Section)

    await this.screenModel.create({
      sectionId: inputSection.id,
      displayOrder: 0,
      name: createFormTranslations.input,
    } as Screen)
  }
}
