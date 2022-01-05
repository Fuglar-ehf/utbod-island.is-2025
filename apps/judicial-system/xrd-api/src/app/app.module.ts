import { Module } from '@nestjs/common'

import { ProblemModule } from '@island.is/nest/problem'
import { AuditTrailModule } from '@island.is/judicial-system/audit-trail'

import { environment } from '../environments'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    AuditTrailModule.register(environment.auditTrail),
    ProblemModule.forRoot({ logAllErrors: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
