import { Module } from '@nestjs/common'

import { AuthAdminApiClientModule } from '@island.is/clients/auth/admin-api'

import { TenantResolver } from './tenant/tenant.resolver'
import { TenantEnvironmentResolver } from './tenant/tenant-environment.resolver'
import { TenantsService } from './tenant/tenants.service'
import { ClientsResolver } from './client/clients.resolver'
import { ClientsService } from './client/clients.service'
import { ClientEnvironmentResolver } from './client/client-environment.resolver'
import { ClientSecretLoader } from './client/client-secret.loader'

@Module({
  imports: [AuthAdminApiClientModule],
  providers: [
    TenantResolver,
    TenantEnvironmentResolver,
    TenantsService,
    ClientsResolver,
    ClientEnvironmentResolver,
    ClientsService,
    ClientSecretLoader,
  ],
})
export class AuthAdminModule {}
