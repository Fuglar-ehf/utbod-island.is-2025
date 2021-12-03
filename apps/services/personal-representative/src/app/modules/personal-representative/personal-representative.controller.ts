import {
  PersonalRepresentativeDTO,
  PersonalRepresentativeService,
} from '@island.is/auth-api-lib/personal-representative'
import {
  BadRequestException,
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Inject,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger'
import { AuthGuard } from '../common'

@ApiTags('Personal Representative')
@Controller('v1/personal-representative')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PersonalRepresentativeController {
  constructor(
    @Inject(PersonalRepresentativeService)
    private readonly prService: PersonalRepresentativeService,
  ) {}

  /** Gets all persoanal representatives */
  @ApiOperation({ summary: 'Gets all persoanal representatives' })
  @Get('all/:includeInvalid?')
  @ApiOkResponse({
    description: 'Personal representative connections with rights',
    type: PersonalRepresentativeDTO,
  })
  @ApiParam({
    name: 'includeInvalid',
    required: false,
    type: 'boolean',
    allowEmptyValue: true,
  })
  async getAll(
    @Param('includeInvalid') includeInvalid?: boolean,
  ): Promise<PersonalRepresentativeDTO[]> {
    const personalRepresentatives = await this.prService.getAllAsync(
      includeInvalid ? (includeInvalid as boolean) : false,
    )

    if (!personalRepresentatives) {
      throw new NotFoundException('No personal representatives found')
    }

    return personalRepresentatives
  }

  /** Gets a personal representative rights by it's id */
  @ApiOperation({ summary: 'Gets a personal representative rights by id' })
  @Get(':id')
  @ApiOkResponse({
    description: 'Personal representative connection with rights',
    type: PersonalRepresentativeDTO,
  })
  async getAsync(@Param('id') id: string): Promise<PersonalRepresentativeDTO> {
    if (!id) {
      throw new BadRequestException('Id needs to be provided')
    }

    const personalRepresentative = await this.prService.getPersonalRepresentativeAsync(
      id,
    )

    if (!personalRepresentative) {
      throw new NotFoundException(
        "This particular personal representative doesn't exist",
      )
    }

    return personalRepresentative
  }

  /** Gets a personal representative rights by nationalId of personal representative */
  @ApiOperation({
    summary:
      'Gets personal representative rights by nationalId of personal representative',
    description: 'A personal representative can represent more than one person',
  })
  @Get('byPersonalRepresentative/:nationalId/:includeInvalid?')
  @ApiOkResponse({
    description: 'Personal representative connections with rights',
    type: PersonalRepresentativeDTO,
  })
  @ApiParam({ name: 'nationalId', required: true, type: String })
  @ApiParam({
    name: 'includeInvalid',
    required: false,
    type: 'boolean',
    allowEmptyValue: true,
  })
  async getByPersonalRepresentativeAsync(
    nationalId: string,
    includeInvalid?: boolean,
  ): Promise<PersonalRepresentativeDTO[]> {
    if (!nationalId) {
      throw new BadRequestException('NationalId needs to be provided')
    }

    const personalRepresentatives = await this.prService.getByPersonalRepresentativeAsync(
      nationalId,
      includeInvalid ? (includeInvalid as boolean) : false,
    )

    return personalRepresentatives
  }

  /** Gets a personal representative rights by nationalId of represented person */
  @ApiOperation({
    summary:
      'Gets a personal representative rights by nationalId of represented person',
  })
  @Get('byRepresentedPerson/:nationalId/:includeInvalid?')
  @ApiOkResponse({
    description: 'Personal representative connection with rights',
    type: PersonalRepresentativeDTO,
  })
  @ApiParam({ name: 'nationalId', required: true, type: String })
  @ApiParam({
    name: 'includeInvalid',
    required: false,
    type: 'boolean',
    allowEmptyValue: false,
  })
  async getByRepresentedPersonAsync(
    nationalId: string,
    includeInvalid?: boolean,
  ): Promise<PersonalRepresentativeDTO | null> {
    if (!nationalId) {
      throw new BadRequestException('NationalId needs to be provided')
    }

    const personalRepresentative = await this.prService.getPersonalRepresentativeByRepresentedPersonAsync(
      nationalId,
      includeInvalid ? (includeInvalid as boolean) : false,
    )

    return personalRepresentative
  }

  /** Removes a personal representative by it's id */
  @ApiOperation({
    summary: 'Delete a personal representative connection by id',
  })
  @Delete(':id')
  @ApiOkResponse()
  async removeAsync(@Param('id') id: string): Promise<number> {
    if (!id) {
      throw new BadRequestException('Id needs to be provided')
    }

    return await this.prService.deleteAsync(id)
  }

  /** Creates a right type */
  @ApiOperation({
    summary: 'Create a new personal representative connection',
    description:
      'All other connections between nationalIds are removed, right list must be supplied',
  })
  @Post()
  @ApiCreatedResponse({
    description: 'Created personal representative connections with rights',
    type: PersonalRepresentativeDTO,
  })
  async create(
    @Body() personalRepresentatives: PersonalRepresentativeDTO,
  ): Promise<PersonalRepresentativeDTO | null> {
    return await this.prService.createAsync(personalRepresentatives)
  }
}
