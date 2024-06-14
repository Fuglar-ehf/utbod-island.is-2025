import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { RskRelationshipsClientModule } from '@island.is/clients-rsk-relationships'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { UserSystemNotificationModule } from '../user-notification'

import { ClientAllowedScope } from '../clients/models/client-allowed-scope.model'
import { Client } from '../clients/models/client.model'
import { PersonalRepresentativeModule } from '../personal-representative/personal-representative.module'
import { ApiScope } from '../resources/models/api-scope.model'
import { IdentityResource } from '../resources/models/identity-resource.model'
import { ResourcesModule } from '../resources/resources.module'
import { DelegationScopeService } from './delegation-scope.service'
import { DelegationsOutgoingService } from './delegations-outgoing.service'
import { DelegationsService } from './delegations.service'
import { DelegationsIncomingService } from './delegations-incoming.service'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'
import { NamesService } from './names.service'
import { DelegationsIncomingWardService } from './delegations-incoming-ward.service'
import { IncomingDelegationsCompanyService } from './delegations-incoming-company.service'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { DelegationsIncomingRepresentativeService } from './delegations-incoming-representative.service'
import { ApiScopeUserAccess } from '../resources/models/api-scope-user-access.model'
import { DelegationIndex } from './models/delegation-index.model'
import { DelegationIndexMeta } from './models/delegation-index-meta.model'
import { DelegationsIndexService } from './delegations-index.service'
import { UserIdentitiesModule } from '../user-identities/user-identities.module'
import { DelegationTypeModel } from './models/delegation-type.model'
import { DelegationProviderModel } from './models/delegation-provider.model'
import { DelegationProviderService } from './delegation-provider.service'
import { ApiScopeDelegationType } from '../resources/models/api-scope-delegation-type.model'

@Module({
  imports: [
    ResourcesModule,
    PersonalRepresentativeModule,
    NationalRegistryClientModule,
    RskRelationshipsClientModule,
    UserIdentitiesModule,
    FeatureFlagModule,
    SequelizeModule.forFeature([
      ApiScope,
      ApiScopeDelegationType,
      IdentityResource,
      Delegation,
      DelegationScope,
      DelegationIndex,
      DelegationIndexMeta,
      Client,
      ClientAllowedScope,
      ApiScopeUserAccess,
      DelegationTypeModel,
      DelegationProviderModel,
    ]),
    UserSystemNotificationModule,
  ],
  providers: [
    DelegationsService,
    DelegationsOutgoingService,
    DelegationsIncomingService,
    DelegationScopeService,
    NamesService,
    DelegationsIncomingWardService,
    IncomingDelegationsCompanyService,
    DelegationsIncomingCustomService,
    DelegationsIncomingRepresentativeService,
    DelegationsIndexService,
    DelegationProviderService,
  ],
  exports: [
    DelegationsService,
    DelegationsOutgoingService,
    DelegationsIncomingService,
    DelegationScopeService,
    DelegationsIndexService,
    DelegationProviderService,
  ],
})
export class DelegationsModule {}
