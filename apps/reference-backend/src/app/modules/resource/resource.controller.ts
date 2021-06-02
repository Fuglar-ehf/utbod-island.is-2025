import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { Resource } from './resource.model'
import { ResourceService } from './resource.service'
import { ResourceDto } from './dto/resource.dto'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('resource')
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Creates a resource record.',
    type: Resource,
  })
  async create(@Body() resource: ResourceDto): Promise<Resource> {
    return await this.resourceService.create(resource)
  }

  @Get(':nationalId')
  @ApiOkResponse({
    description: 'Finds one record using national id',
  })
  async findOne(@Param('nationalId') nationalId: string): Promise<Resource> {
    const resource = await this.resourceService.findByNationalId(nationalId)

    if (!resource) {
      throw new NotFoundException("This resource doesn't exist")
    }

    return resource
  }
}
