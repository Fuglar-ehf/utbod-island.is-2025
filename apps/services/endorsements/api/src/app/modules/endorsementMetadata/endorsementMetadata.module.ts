import { Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { EndorsementMetadataService } from './endorsementMetadata.service'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'
import { NationalRegistryUserService } from './providers/nationalRegistry/nationalRegistryUser.service'
import { environment } from '../../../environments'
import { NationalRegistryApiMock } from './providers/nationalRegistry/mock/nationalRegistryApiMock'
import { SequelizeModule } from '@nestjs/sequelize'
import { Endorsement } from '../endorsement/models/endorsement.model'
import { EndorsementSystemSignedListsService } from './providers/endorsementSystem/endorsementSystemSignedLists.service'
import {
  Configuration,
  TemporaryVoterRegistryApi,
} from './providers/temporaryVoterRegistry/gen/fetch'
import { TemporaryVoterRegistryService } from './providers/temporaryVoterRegistry/temporaryVoterRegistry.service'
import { TemporaryVoterRegistryApiMock } from './providers/temporaryVoterRegistry/mock/temporaryVoterRegistryApiMock'

@Module({
  imports: [SequelizeModule.forFeature([Endorsement])],
  providers: [
    NationalRegistryUserService,
    EndorsementSystemSignedListsService,
    EndorsementMetadataService,
    TemporaryVoterRegistryService,
    {
      provide: NationalRegistryApi,
      useFactory: async () =>
        await NationalRegistryApi.instantiateClass(
          environment.metadataProvider
            .nationalRegistry as NationalRegistryConfig,
        ),
      ...(environment.apiMock
        ? { useValue: new NationalRegistryApiMock() }
        : {}),
    },
    {
      provide: TemporaryVoterRegistryApi,
      useFactory: async () =>
        new TemporaryVoterRegistryApi(
          new Configuration({
            fetchApi: fetch,
            basePath: environment.metadataProvider.temporaryVoterRegistry
              .baseApiUrl as string,
          }),
        ),
      ...(environment.apiMock
        ? { useValue: new TemporaryVoterRegistryApiMock() }
        : {}),
    },
  ],
  exports: [EndorsementMetadataService],
})
export class EndorsementMetadataModule {}
