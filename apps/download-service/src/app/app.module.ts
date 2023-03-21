import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { DocumentsClientModule } from '@island.is/clients/documents'
import {
  FinanceClientConfig,
  FinanceClientModule,
} from '@island.is/clients/finance'
import { AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import { DocumentController } from './modules/documents/document.controller'
import { DocumentsInfraController } from './modules/infra/documentsInfra.controller'
import { FinanceDocumentController } from './modules/finance-documents/document.controller'
import { environment } from '../environments'
import { VehicleController } from './modules/vehicles-documents/vehicle-document.controller'
import { RegulationDocumentsController } from './modules/regulation-documents/regulation-documents.controller'
import {
  VehiclesClientConfig,
  VehiclesClientModule,
} from '@island.is/clients/vehicles'
import {
  RegulationsClientConfig,
  RegulationsClientModule,
} from '@island.is/clients/regulations'
import {
  RegulationsAdminClientConfig,
  RegulationsAdminClientModule,
} from '@island.is/clients/regulations-admin'

@Module({
  controllers: [
    DocumentController,
    DocumentsInfraController,
    FinanceDocumentController,
    VehicleController,
    RegulationDocumentsController,
  ],
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    DocumentsClientModule.register({
      basePath: environment.documentService.basePath,
      clientId: environment.documentService.clientId,
      clientSecret: environment.documentService.clientSecret,
      tokenUrl: environment.documentService.tokenUrl,
    }),
    FinanceClientModule,
    VehiclesClientModule,
    RegulationsAdminClientModule,
    RegulationsClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        FinanceClientConfig,
        IdsClientConfig,
        XRoadConfig,
        VehiclesClientConfig,
        RegulationsAdminClientConfig,
        RegulationsClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
