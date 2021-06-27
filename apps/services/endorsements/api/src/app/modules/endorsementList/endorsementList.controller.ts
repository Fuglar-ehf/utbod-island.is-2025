import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOAuth2,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Audit } from '@island.is/nest/audit'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListService } from './endorsementList.service'
import { EndorsementListDto } from './dto/endorsementList.dto'
import { FindEndorsementListByTagsDto } from './dto/findEndorsementListsByTags.dto'
import { Endorsement } from '../endorsement/models/endorsement.model'
import { BypassAuth, CurrentUser } from '@island.is/auth-nest-tools'
import { EndorsementListByIdPipe } from './pipes/endorsementListById.pipe'
import { IsEndorsementListOwnerValidationPipe } from './pipes/isEndorsementListOwnerValidation.pipe'
import { environment } from '../../../environments'
import type { User } from '@island.is/auth-nest-tools'

const auditNamespace = `${environment.audit.defaultNamespace}/endorsement-list`

@ApiTags('endorsementList')
@Controller('endorsement-list')
@ApiOAuth2([])
export class EndorsementListController {
  constructor(
    private readonly endorsementListService: EndorsementListService,
  ) {}

  @ApiOkResponse({
    description: 'Finds all endorsement lists belonging to a given tag',
    type: [EndorsementList],
  })
  @Get()
  @BypassAuth()
  async findByTags(
    @Query() { tags }: FindEndorsementListByTagsDto,
  ): Promise<EndorsementList[]> {
    // TODO: Add pagination
    return await this.endorsementListService.findListsByTags(
      !Array.isArray(tags) ? [tags] : tags, // query parameters of length one are not arrays, we normalize all tags input to arrays here
    )
  }

  /**
   * This exists so we can return all endorsements for user across all lists
   */
  @ApiOkResponse({
    description: 'Finds all endorsements for the currently authenticated user',
    type: [Endorsement],
  })
  @Get('/endorsements')
  @Audit<Endorsement[]>({
    namespace: auditNamespace,
    action: 'findEndorsements',
    resources: (endorsement) => endorsement.map((e) => e.id),
    meta: (endorsement) => ({ count: endorsement.length }),
  })
  async findEndorsements(@CurrentUser() user: User): Promise<Endorsement[]> {
    // TODO: Add pagination
    return await this.endorsementListService.findAllEndorsementsByNationalId(
      user.nationalId,
    )
  }

  @ApiOkResponse({
    description: 'Finds a single endorsements list by id',
    type: EndorsementList,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  @Get(':listId')
  @Audit<EndorsementList>({
    namespace: auditNamespace,
    action: 'findOne',
    resources: (endorsementList) => endorsementList.id,
  })
  async findOne(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return endorsementList
  }

  @ApiOkResponse({
    description: 'Close a single endorsements list by id',
    type: EndorsementList,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  @Put(':listId/close')
  @Audit<EndorsementList>({
    namespace: auditNamespace,
    action: 'close',
    resources: (endorsementList) => endorsementList.id,
  })
  async close(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
      IsEndorsementListOwnerValidationPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.close(endorsementList)
  }

  @ApiOkResponse({
    description: 'Open a single endorsements list by id',
    type: EndorsementList,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  @Put(':listId/open')
  @Audit<EndorsementList>({
    namespace: auditNamespace,
    action: 'open',
    resources: (endorsementList) => endorsementList.id,
  })
  async open(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
      IsEndorsementListOwnerValidationPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.open(endorsementList)
  }

  @ApiOkResponse({
    description: 'Create an endorsements list',
    type: EndorsementList,
  })
  @ApiBody({ type: EndorsementListDto })
  @Post()
  @Audit<EndorsementList>({
    namespace: auditNamespace,
    action: 'create',
    resources: (endorsementList) => endorsementList.id,
    meta: (endorsementList) => ({
      tags: endorsementList.tags,
    }),
  })
  async create(
    @Body() endorsementList: EndorsementListDto,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.create({
      ...endorsementList,
      owner: user.nationalId,
    })
  }
}
