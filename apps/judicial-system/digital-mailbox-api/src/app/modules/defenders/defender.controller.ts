import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { LawyersService } from '@island.is/judicial-system/lawyers'

import { Defender } from './models/defender.response'

@Controller('api')
@ApiTags('defenders')
@UseInterceptors(CacheInterceptor)
export class DefenderController {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly lawyersService: LawyersService,
  ) {}

  @Get('defenders')
  @ApiCreatedResponse({
    type: [Defender],
    description: 'Retrieves a list of defenders',
  })
  async getLawyers(): Promise<Defender[]> {
    try {
      this.logger.debug('Retrieving lawyers from lawyer registry')

      const lawyers = await this.lawyersService.getLawyers()
      return lawyers.map((lawyer) => ({
        nationalId: lawyer.SSN,
        name: lawyer.Name,
        practice: lawyer.Practice,
      }))
    } catch (error) {
      this.logger.error('Failed to retrieve lawyers', error)
      throw new InternalServerErrorException('Failed to retrieve lawyers')
    }
  }
}
