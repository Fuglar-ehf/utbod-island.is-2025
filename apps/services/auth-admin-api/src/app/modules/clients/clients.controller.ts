import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  Post,
  Body,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiTags,
  ApiOAuth2,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import {
  Client,
  ClientsService,
  ClientDTO,
  ClientUpdateDTO,
} from '@island.is/auth-api-lib'
import { AuthGuard } from '@nestjs/passport'

@ApiOAuth2(['@identityserver.api/read'])
@UseGuards(AuthGuard('jwt'))
@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get(':id')
  @ApiOkResponse({ type: Client })
  async findOne(@Param('id') id: string): Promise<Client> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    const clientProfile = await this.clientsService.findClientById(id)

    if (!clientProfile) {
      throw new NotFoundException("This client doesn't exist")
    }

    return clientProfile
  }

  @Post()
  @ApiCreatedResponse({ type: Client })
  async create(@Body() client: ClientDTO): Promise<Client> {
    return await this.clientsService.create(client)
  }

  @Put(':id')
  @ApiCreatedResponse({ type: Client })
  async update(
    @Body() client: ClientUpdateDTO,
    @Param('id') id: string,
  ): Promise<Client> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return await this.clientsService.update(client, id)
  }

  @Delete(':id')
  @ApiCreatedResponse()
  async delete(@Param('id') id: string): Promise<number> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return await this.clientsService.delete(id)
  }
}
