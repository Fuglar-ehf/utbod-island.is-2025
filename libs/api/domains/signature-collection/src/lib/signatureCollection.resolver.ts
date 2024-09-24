import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { SignatureCollectionSuccess } from './models/success.model'
import { SignatureCollectionService } from './signatureCollection.service'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  CurrentUser,
  BypassAuth,
  ScopesGuard,
  Scopes,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { UserAccessGuard } from './guards/userAccess.guard'
import { ApiScope } from '@island.is/auth/scopes'
import {
  SignatureCollectionAddListsInput,
  SignatureCollectionCancelListsInput,
  SignatureCollectionCanSignInput,
  SignatureCollectionIdInput,
  SignatureCollectionListIdInput,
  SignatureCollectionUploadPaperSignatureInput,
} from './dto'
import {
  AllowDelegation,
  AllowManager,
  CurrentSignee,
  IsOwner,
} from './decorators'
import {
  SignatureCollection,
  SignatureCollectionList,
  SignatureCollectionListBase,
  SignatureCollectionSignature,
  SignatureCollectionSignedList,
  SignatureCollectionSignee,
} from './models'

@UseGuards(IdsUserGuard, ScopesGuard, UserAccessGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/signature-collection' })
export class SignatureCollectionResolver {
  constructor(private signatureCollectionService: SignatureCollectionService) {}

  @Scopes(ApiScope.signatureCollection)
  @Query(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionIsOwner(
    @CurrentSignee() signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionSuccess> {
    return { success: signee.isOwner }
  }

  @BypassAuth()
  @Query(() => SignatureCollection)
  async signatureCollectionCurrent(): Promise<SignatureCollection> {
    return this.signatureCollectionService.currentCollection()
  }

  @BypassAuth()
  @Query(() => [SignatureCollectionListBase])
  async signatureCollectionAllOpenLists(
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionListBase[]> {
    return this.signatureCollectionService.allOpenLists(input)
  }

  @Scopes(ApiScope.signatureCollection)
  @AllowManager()
  @IsOwner()
  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionListsForOwner(
    @CurrentSignee() signee: SignatureCollectionSignee,
    @Args('input') input: SignatureCollectionIdInput,
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.listsForOwner(input, signee, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @Query(() => [SignatureCollectionListBase])
  @Audit()
  async signatureCollectionListsForUser(
    @CurrentSignee() signee: SignatureCollectionSignee,
    @Args('input') input: SignatureCollectionIdInput,
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionListBase[]> {
    return this.signatureCollectionService.listsForUser(input, signee, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @AllowManager()
  @Query(() => SignatureCollectionList)
  @Audit()
  async signatureCollectionList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionList> {
    return this.signatureCollectionService.list(input.listId, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @Query(() => [SignatureCollectionSignedList], { nullable: true })
  @Audit()
  async signatureCollectionSignedList(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSignedList[] | null> {
    return this.signatureCollectionService.signedList(user)
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @AllowManager()
  @Query(() => [SignatureCollectionSignature], { nullable: true })
  @Audit()
  async signatureCollectionSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.signatures(input.listId, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @Query(() => SignatureCollectionSignee)
  @Audit()
  async signatureCollectionSignee(
    @CurrentSignee() signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionSignee> {
    return signee
  }

  @Scopes(ApiScope.signatureCollection)
  @Query(() => Boolean)
  @IsOwner()
  @AllowManager()
  @Audit()
  async signatureCollectionCanSign(
    @Args('input') input: SignatureCollectionCanSignInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return (
      await this.signatureCollectionService.signee(user, input.signeeNationalId)
    ).canSign
  }

  @Scopes(ApiScope.signatureCollection)
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUnsign(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.unsign(input.listId, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionCancel(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionCancelListsInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.cancel(input, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAddAreas(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionAddListsInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.add(input, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUploadPaperSignature(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionUploadPaperSignatureInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.candidacyUploadPaperSignature(
      input,
      user,
    )
  }
}
