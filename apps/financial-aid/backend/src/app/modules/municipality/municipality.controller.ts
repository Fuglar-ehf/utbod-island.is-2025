import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'

import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { MunicipalityService } from './municipality.service'
import { MunicipalityModel } from './models'

import { apiBasePath, StaffRole } from '@island.is/financial-aid/shared/lib'
import type { Staff } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { StaffGuard } from '../../guards/staff.guard'
import { StaffRolesRules } from '../../decorators/staffRole.decorator'
import { CurrentStaff } from '../../decorators/staff.decorator'
import {
  MunicipalityActivityDto,
  UpdateMunicipalityDto,
  CreateMunicipalityDto,
} from './dto'
import { CreateStaffDto } from '../staff/dto'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller(`${apiBasePath}/municipality`)
@ApiTags('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @UseGuards(ScopesGuard)
  @Scopes(MunicipalitiesFinancialAidScope.read)
  @Get(':id')
  @ApiOkResponse({
    type: MunicipalityModel,
    description: 'Gets municipality by id',
  })
  async getById(@Param('id') id: string): Promise<MunicipalityModel> {
    const municipality = await this.municipalityService.findByMunicipalityId(id)

    if (!municipality) {
      throw new NotFoundException(404, `municipality ${id} not found`)
    }

    return municipality
  }

  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.SUPERADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.employee)
  @Post('')
  @ApiCreatedResponse({
    type: MunicipalityModel,
    description: 'Creates a new municipality',
  })
  create(
    @CurrentStaff() staff: Staff,
    @Body()
    input: {
      municipalityInput: CreateMunicipalityDto
      adminInput: CreateStaffDto
    },
  ): Promise<MunicipalityModel> {
    return this.municipalityService.create(
      input.municipalityInput,
      input.adminInput,
      staff,
    )
  }

  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.SUPERADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.employee)
  @Get('')
  @ApiOkResponse({
    type: [MunicipalityModel],
    description: 'Gets municipalities',
  })
  async getAllMunicipalities(): Promise<MunicipalityModel[]> {
    return await this.municipalityService.getAll()
  }

  @Put('')
  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.ADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.employee)
  @ApiOkResponse({
    type: MunicipalityModel,
    description: 'Updates municipality',
  })
  async updateMunicipality(
    @CurrentStaff() staff: Staff,
    @Body() input: UpdateMunicipalityDto,
  ): Promise<MunicipalityModel> {
    return await this.municipalityService.updateMunicipality(
      staff.municipalityId,
      input,
    )
  }

  @Put('activity/:id')
  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.SUPERADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.employee)
  @ApiOkResponse({
    type: MunicipalityModel,
    description: 'Updates activity for municipality',
  })
  async updateMunicipalityActivity(
    @Param('id') id: string,
    @Body() municipalityToUpdate: MunicipalityActivityDto,
  ): Promise<MunicipalityModel> {
    const {
      numberOfAffectedRows,
      updatedMunicipality,
    } = await this.municipalityService.update(id, municipalityToUpdate)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Municipality ${id} does not exist`)
    }

    return updatedMunicipality
  }
}
