import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import {
  CreateListItemInput,
  DeleteListItemInput,
  UpdateListItemDisplayOrderInput,
  UpdateListItemInput,
} from '../../dto/listItem.input'
import { ListItemsService } from './listItems.service'
import { ListItem } from '../../models/listItem.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class ListItemsResolver {
  constructor(private readonly listItemsService: ListItemsService) { }

  @Mutation(() => ListItem, {
    name: 'formSystemCreateListItem',
  })
  async createListItem(
    @Args('input', { type: () => CreateListItemInput })
    input: CreateListItemInput,
    @CurrentUser() user: User,
  ): Promise<ListItem> {
    return this.listItemsService.createListItem(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteListItem',
    nullable: true,
  })
  async deleteListItem(
    @Args('input', { type: () => DeleteListItemInput })
    input: DeleteListItemInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.listItemsService.deleteListItem(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateListItem',
    nullable: true,
  })
  async updateListItem(
    @Args('input', { type: () => UpdateListItemInput })
    input: UpdateListItemInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.listItemsService.updateListItem(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateListItemsDisplayOrder',
    nullable: true,
  })
  async updateListItemsDisplayOrder(
    @Args('input', { type: () => UpdateListItemDisplayOrderInput })
    input: UpdateListItemDisplayOrderInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.listItemsService.updateListItemsDisplayOrder(user, input)
  }
}
