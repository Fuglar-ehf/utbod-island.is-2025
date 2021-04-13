import { Module } from '@nestjs/common'
import { MetadataService } from './metadata.service'
import { NationalRegistryService } from './providers/nationalRegistry.service'
import { NationalRegistryApi } from '@island.is/clients/national-registry'
import { environment } from '../../../environments/environment'
import { NationalRegistryApiMock } from './providers/mock/nationalRegistryApiMock'

@Module({
  providers: [
    NationalRegistryService,
    MetadataService,
    {
      provide: NationalRegistryApi,
      useFactory: async () =>
        await NationalRegistryApi.instanciateClass(
          environment.metadataProviser.nationalRegistry,
        ),
      // This exists cause mocking soap with msw is out of scope for this project
      ...(environment.apiMock
        ? { useValue: new NationalRegistryApiMock() }
        : {}),
    },
  ],
  exports: [MetadataService],
})
export class MetadataModule {}
