import { DynamicModule, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListController } from './endorsementList.controller'
import { EndorsementListService } from './endorsementList.service'
import { Endorsement } from '../endorsement/models/endorsement.model'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'
import { environment } from '../../../environments'

export interface Config {
  nationalRegistry: NationalRegistryConfig
}

@Module({
  imports: [SequelizeModule.forFeature([EndorsementList, Endorsement])],
  controllers: [EndorsementListController],
  providers: [
    EndorsementListService,
    {
      provide: NationalRegistryApi,
      useFactory: async () =>
        await NationalRegistryApi.instanciateClass(
          environment.metadataProvider
            .nationalRegistry as NationalRegistryConfig,
        ),
    },
  ],
  exports: [EndorsementListService],
})
export class EndorsementListModule {}
