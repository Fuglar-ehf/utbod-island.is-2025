import { Injectable } from '@nestjs/common'
import { FieldSettingsDto } from '../../fieldSettings/models/dto/fieldSettings.dto'
import { FieldDto } from './dto/field.dto'
import { UpdateFieldDto } from './dto/updateField.dto'
import { Field } from './field.model'

@Injectable()
export class FieldMapper {
  mapFieldToFieldDto(
    field: Field,
    fieldSettingsDto: FieldSettingsDto,
  ): FieldDto {
    const fieldDto: FieldDto = {
      id: field.id,
      screenId: field.screenId,
      name: field.name,
      displayOrder: field.displayOrder,
      description: field.description,
      isPartOfMultiset: field.isPartOfMultiset,
      fieldType: field.fieldType,
      fieldSettings: fieldSettingsDto,
    }

    return fieldDto
  }

  mapUpdateFieldDtoToField(field: Field, updateFieldDto: UpdateFieldDto): void {
    field.name = updateFieldDto.name
    field.description = updateFieldDto.description
    field.isPartOfMultiset = updateFieldDto.isPartOfMultiset
    field.fieldType = updateFieldDto.fieldType
    field.modified = new Date()
  }
}
