import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Endorsement } from './models/endorsement.model'
import { EndorsementController } from './endorsement.controller'
import { EndorsementService } from './endorsement.service'
import { EndorsementMetadataModule } from '../endorsementMetadata/endorsementMetadata.module'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementValidatorModule } from '../endorsementValidator/endorsementValidator.module'
import { EndorsementListService } from '../endorsementList/endorsementList.service'

@Module({
  imports: [
    SequelizeModule.forFeature([Endorsement, EndorsementList]),
    EndorsementMetadataModule,
    EndorsementValidatorModule,
  ],
  controllers: [EndorsementController],
  providers: [EndorsementService, EndorsementListService],
})
export class EndorsementModule {}
