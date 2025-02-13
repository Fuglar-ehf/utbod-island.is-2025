import { ApiPropertyOptional } from '@nestjs/swagger'
import { OrganizationDto } from '../../../organizations/models/dto/organization.dto'
import { SectionDto } from '../../../sections/models/dto/section.dto'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class ApplicationDto {
  @ApiPropertyOptional()
  id?: string

  @ApiPropertyOptional({ type: OrganizationDto })
  organization?: OrganizationDto

  @ApiPropertyOptional()
  formId?: string

  @ApiPropertyOptional()
  slug?: string

  @ApiPropertyOptional({ type: Date })
  created?: Date

  @ApiPropertyOptional({ type: Date })
  modified?: Date

  @ApiPropertyOptional({ type: LanguageType })
  name?: LanguageType

  @ApiPropertyOptional({ type: [SectionDto] })
  sections?: SectionDto[]
}
