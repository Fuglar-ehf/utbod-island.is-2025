import { Body, Controller, Param, Put, VERSION_NEUTRAL } from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { ValuesService } from './values.service'
import { ValueDto } from './models/dto/value.dto'

@ApiTags('values')
@Controller({ path: 'values', version: ['1', VERSION_NEUTRAL] })
export class ValuesController {
  constructor(private readonly valuesService: ValuesService) {}

  @ApiOperation({ summary: 'Update a value' })
  @ApiCreatedResponse({
    description: 'Update a value',
    type: ValueDto,
  })
  @ApiBody({ type: Object })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() json: object,
  ): Promise<ValueDto> {
    return await this.valuesService.update(id, json)
  }
}
