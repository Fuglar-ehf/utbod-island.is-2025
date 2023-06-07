import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { TerminusModule } from '@nestjs/terminus'

import { AirDiscountSchemeModule } from '@island.is/api/domains/air-discount-scheme'
import { ApiCatalogueModule } from '@island.is/api/domains/api-catalogue'
import { ApplicationModule } from '@island.is/api/domains/application'
import { AssetsModule } from '@island.is/api/domains/assets'
//import responseCachePlugin from 'apollo-server-plugin-response-cache'
import { AuthModule as AuthDomainModule } from '@island.is/api/domains/auth'
import { AuthAdminModule } from '@island.is/api/domains/auth-admin'
import {
  CommunicationsConfig,
  CommunicationsModule,
} from '@island.is/api/domains/communications'
import { CompanyRegistryModule } from '@island.is/api/domains/company-registry'
import { ConsultationPortalModule } from '@island.is/api/domains/consultation-portal'
import { ContentSearchModule } from '@island.is/api/domains/content-search'
import { CriminalRecordModule } from '@island.is/api/domains/criminal-record'
import { DirectorateOfLabourModule } from '@island.is/api/domains/directorate-of-labour'
import { DisabilityLicenseModule } from '@island.is/api/domains/disability-license'
import { DocumentProviderModule } from '@island.is/api/domains/document-provider'
import { DocumentModule } from '@island.is/api/domains/documents'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'
import { DrivingLicenseBookModule } from '@island.is/api/domains/driving-license-book'
import { EducationModule } from '@island.is/api/domains/education'
import { ElectronicRegistrationsModule } from '@island.is/api/domains/electronic-registration-statistics'
import {
  EmailSignupModule,
  ZenterSignupConfig,
} from '@island.is/api/domains/email-signup'
import { EndorsementSystemModule } from '@island.is/api/domains/endorsement-system'
import { FileUploadModule } from '@island.is/api/domains/file-upload'
import { FinanceModule } from '@island.is/api/domains/finance'
import { FinancialStatementsInaoModule } from '@island.is/api/domains/financial-statements-inao'
import { FishingLicenseModule } from '@island.is/api/domains/fishing-license'
import { FiskistofaModule } from '@island.is/api/domains/fiskistofa'
import { HealthInsuranceModule } from '@island.is/api/domains/health-insurance'
import { IcelandicNamesModule } from '@island.is/api/domains/icelandic-names-registry'
import { IdentityModule } from '@island.is/api/domains/identity'
import {
  GenericAdrLicenseConfig,
  GenericDisabilityLicenseConfig,
  GenericDrivingLicenseConfig,
  GenericFirearmLicenseConfig,
  GenericMachineLicenseConfig,
  LicenseServiceModule,
} from '@island.is/api/domains/license-service'
import { MortgageCertificateModule } from '@island.is/api/domains/mortgage-certificate'
import { MunicipalitiesFinancialAidModule } from '@island.is/api/domains/municipalities-financial-aid'
import { NationalRegistryModule } from '@island.is/api/domains/national-registry'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { PassportModule } from '@island.is/api/domains/passport'
import { ApiDomainsPaymentModule } from '@island.is/api/domains/payment'
import { PaymentScheduleModule } from '@island.is/api/domains/payment-schedule'
import { RegulationsModule } from '@island.is/api/domains/regulations'
import { RegulationsAdminModule } from '@island.is/api/domains/regulations-admin'
import { RightsPortalModule } from '@island.is/api/domains/rights-portal'
import { SessionsModule } from '@island.is/api/domains/sessions'
import { SyslumennModule } from '@island.is/api/domains/syslumenn'
import { TransportAuthorityApiModule } from '@island.is/api/domains/transport-authority'
import { UniversityOfIcelandModule } from '@island.is/api/domains/university-of-iceland'
import { UserProfileModule } from '@island.is/api/domains/user-profile'
import { VehiclesModule } from '@island.is/api/domains/vehicles'
import {
  WatsonAssistantChatConfig,
  WatsonAssistantChatModule,
} from '@island.is/api/domains/watson-assistant-chat'
import { IcelandicGovernmentInstitutionVacanciesModule } from '@island.is/api/domains/icelandic-government-institution-vacancies'
import { AuthConfig, AuthModule } from '@island.is/auth-nest-tools'
import { AdrAndMachineLicenseClientConfig } from '@island.is/clients/adr-and-machine-license'
import { AirDiscountSchemeClientConfig } from '@island.is/clients/air-discount-scheme'
import { AssetsClientConfig } from '@island.is/clients/assets'
import { AuthAdminApiClientConfig } from '@island.is/clients/auth/admin-api'
import { AuthDelegationApiClientConfig } from '@island.is/clients/auth/delegation-api'
import { AuthIdsApiClientConfig } from '@island.is/clients/auth/ids-api'
import { AuthPublicApiClientConfig } from '@island.is/clients/auth/public-api'
import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'
import { ConsultationPortalClientConfig } from '@island.is/clients/consultation-portal'
import { DisabilityLicenseClientConfig } from '@island.is/clients/disability-license'
import { DrivingLicenseApiConfig } from '@island.is/clients/driving-license'
import { DrivingLicenseBookClientConfig } from '@island.is/clients/driving-license-book'
import { ElectronicRegistrationsClientConfig } from '@island.is/clients/electronic-registration-statistics'
import { FinanceClientConfig } from '@island.is/clients/finance'
import { FinancialStatementsInaoClientConfig } from '@island.is/clients/financial-statements-inao'
import { FirearmLicenseClientConfig } from '@island.is/clients/firearm-license'
import { FishingLicenseClientConfig } from '@island.is/clients/fishing-license'
import { FiskistofaClientConfig } from '@island.is/clients/fiskistofa'
import { IcelandicGovernmentInstitutionVacanciesClientConfig } from '@island.is/clients/icelandic-government-institution-vacancies'
import { JudicialAdministrationClientConfig } from '@island.is/clients/judicial-administration'
import { MunicipalitiesFinancialAidConfig } from '@island.is/clients/municipalities-financial-aid'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { PassportsClientConfig } from '@island.is/clients/passports'
import { PaymentScheduleClientConfig } from '@island.is/clients/payment-schedule'
import { RegulationsClientConfig } from '@island.is/clients/regulations'
import { RegulationsAdminClientConfig } from '@island.is/clients/regulations-admin'
import { RightsPortalClientConfig } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { SessionsApiClientConfig } from '@island.is/clients/sessions'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import { UniversityOfIcelandClientConfig } from '@island.is/clients/university-of-iceland'
import { VehiclesClientConfig } from '@island.is/clients/vehicles'
import { CmsModule, PowerBiConfig } from '@island.is/cms'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { FileStorageConfig } from '@island.is/file-storage'
import { AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  DownloadServiceConfig,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { DataLoaderInterceptor } from '@island.is/nest/dataloader'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'

import { getConfig } from './environments'
import { maskOutFieldsMiddleware } from './graphql.middleware'
import { HealthController } from './health.controller'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const environment = getConfig
const autoSchemaFile = environment.production
  ? true
  : 'apps/api/src/api.graphql'

@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      buildSchemaOptions: {
        fieldMiddleware: [maskOutFieldsMiddleware],
      },
      plugins: [
        // This was causing problems since graphql upgrade, gives us issues like:
        // Error: overallCachePolicy.policyIfCacheable is not a function
        // responseCachePlugin({
        //   shouldReadFromCache: ({ request: { http } }) => {
        //     const bypassCacheKey = http?.headers.get('bypass-cache-key')
        //     return bypassCacheKey !== process.env.BYPASS_CACHE_KEY
        //   },
        // }),
      ],
    }),
    AuthDomainModule,
    AuditModule.forRoot(environment.audit),
    ContentSearchModule,
    ConsultationPortalModule,
    CmsModule,
    DrivingLicenseModule,
    DrivingLicenseBookModule,
    EducationModule.register({
      xroad: {
        baseUrl: environment.xroad.baseUrl!,
        clientId: environment.xroad.clientId!,
        services: {
          license: environment.education.xroadLicenseServiceId!,
          grade: environment.education.xroadGradeServiceId!,
        },
      },
      nationalRegistry: {
        baseSoapUrl: environment.nationalRegistry.baseSoapUrl!,
        user: environment.nationalRegistry.user!,
        password: environment.nationalRegistry.password!,
        host: environment.nationalRegistry.host!,
      },

      fileDownloadBucket: environment.education.fileDownloadBucket!,
    }),
    ApplicationModule.register({
      baseApiUrl: environment.applicationSystem.baseApiUrl!,
    }),
    LicenseServiceModule,
    DirectorateOfLabourModule.register(),
    FileUploadModule,
    DocumentModule.register({
      documentClientConfig: {
        basePath: environment.documentService.basePath!,
        clientId: environment.documentService.clientId,
        clientSecret: environment.documentService.clientSecret,
        tokenUrl: environment.documentService.tokenUrl,
      },
    }),
    DocumentProviderModule.register({
      test: {
        basePath: environment.documentProviderService.test.basePath!,
        clientId: environment.documentProviderService.test.clientId,
        clientSecret: environment.documentProviderService.test.clientSecret,
        tokenUrl: environment.documentProviderService.test.tokenUrl,
      },
      prod: {
        basePath: environment.documentProviderService.prod.basePath!,
        clientId: environment.documentProviderService.prod.clientId,
        clientSecret: environment.documentProviderService.prod.clientSecret,
        tokenUrl: environment.documentProviderService.prod.tokenUrl,
      },
      documentsServiceBasePath: environment.documentProviderService
        .documentsServiceBasePath!,
      documentProviderAdmins: environment.documentProviderService
        .documentProviderAdmins!,
    }),
    CmsTranslationsModule,
    TerminusModule,
    NationalRegistryModule.register({
      nationalRegistry: {
        baseSoapUrl: environment.nationalRegistry.baseSoapUrl!,
        user: environment.nationalRegistry.user!,
        password: environment.nationalRegistry.password!,
        host: environment.nationalRegistry.host!,
      },
    }),
    HealthInsuranceModule.register({
      clientV2Config: {
        xRoadBaseUrl: environment.healthInsuranceV2.xRoadBaseUrl!,
        xRoadProviderId: environment.healthInsuranceV2.xRoadProviderId!,
        xRoadClientId: environment.healthInsuranceV2.xRoadClientId!,
        username: environment.healthInsuranceV2.username!,
        password: environment.healthInsuranceV2.password!,
      },
    }),
    UserProfileModule.register({
      userProfileServiceBasePath: environment.userProfile
        .userProfileServiceBasePath!,
      islykill: {
        cert: environment.islykill.cert!,
        passphrase: environment.islykill.passphrase!,
        basePath: environment.islykill.basePath!,
      },
    }),
    CommunicationsModule,
    EmailSignupModule,
    ApiCatalogueModule,
    IdentityModule,
    AuthModule.register(environment.auth as AuthConfig),
    SyslumennModule,
    DisabilityLicenseModule,
    ElectronicRegistrationsModule,
    FiskistofaModule,
    WatsonAssistantChatModule,
    IcelandicGovernmentInstitutionVacanciesModule,
    CompanyRegistryModule,
    IcelandicNamesModule.register({
      backendUrl: environment.icelandicNamesRegistry.backendUrl!,
    }),
    EndorsementSystemModule.register({
      baseApiUrl: environment.endorsementSystem.baseApiUrl!,
    }),
    RegulationsModule,
    RegulationsAdminModule,
    FinanceModule,
    FinancialStatementsInaoModule,
    VehiclesModule,
    RightsPortalModule,
    AssetsModule,
    PassportModule,
    AirDiscountSchemeModule,
    NationalRegistryXRoadModule,
    ApiDomainsPaymentModule,
    PaymentScheduleModule,
    ProblemModule,
    CriminalRecordModule.register({
      clientConfig: {
        xroadBaseUrl: environment.xroad.baseUrl!,
        xroadClientId: environment.xroad.clientId!,
        xroadPath: environment.criminalRecord.xroadPath!,
      },
    }),
    MunicipalitiesFinancialAidModule,
    FishingLicenseModule,
    MortgageCertificateModule,
    TransportAuthorityApiModule,
    UniversityOfIcelandModule,
    SessionsModule,
    AuthAdminModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        AdrAndMachineLicenseClientConfig,
        AirDiscountSchemeClientConfig,
        ConsultationPortalClientConfig,
        AssetsClientConfig,
        FirearmLicenseClientConfig,
        DisabilityLicenseClientConfig,
        GenericFirearmLicenseConfig,
        GenericMachineLicenseConfig,
        GenericAdrLicenseConfig,
        GenericDrivingLicenseConfig,
        GenericDisabilityLicenseConfig,
        VehiclesClientConfig,
        RightsPortalClientConfig,
        AuthPublicApiClientConfig,
        AuthDelegationApiClientConfig,
        DownloadServiceConfig,
        FeatureFlagConfig,
        FinanceClientConfig,
        RegulationsAdminClientConfig,
        RegulationsClientConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        SyslumennClientConfig,
        ElectronicRegistrationsClientConfig,
        FeatureFlagConfig,
        XRoadConfig,
        MunicipalitiesFinancialAidConfig,
        CompanyRegistryConfig,
        FishingLicenseClientConfig,
        FinancialStatementsInaoClientConfig,
        DrivingLicenseBookClientConfig,
        DrivingLicenseApiConfig,
        PassportsClientConfig,
        FileStorageConfig,
        FiskistofaClientConfig,
        ChargeFjsV2ClientConfig,
        DisabilityLicenseClientConfig,
        ZenterSignupConfig,
        PaymentScheduleClientConfig,
        JudicialAdministrationClientConfig,
        CommunicationsConfig,
        UniversityOfIcelandClientConfig,
        SessionsApiClientConfig,
        AuthAdminApiClientConfig,
        WatsonAssistantChatConfig,
        PowerBiConfig,
        AuthIdsApiClientConfig,
        IcelandicGovernmentInstitutionVacanciesClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
