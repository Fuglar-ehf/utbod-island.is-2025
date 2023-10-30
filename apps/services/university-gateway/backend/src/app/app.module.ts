import { Module } from '@nestjs/common'
import { ApplicationModule } from './modules/application/application.module'
import { CourseModule } from './modules/course/course.module'
import { ProgramModule } from './modules/program/program.module'
import { UniversityModule } from './modules/university/university.module'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { ConfigModule } from '@nestjs/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { ReykjavikUniversityApplicationClientConfig } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClientConfig } from '@island.is/clients/university-application/university-of-iceland'
import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { environment } from '../environments'

@Module({
  imports: [
    ApplicationModule,
    CourseModule,
    ProgramModule,
    UniversityModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SharedAuthModule.register({
      jwtSecret: environment.auth.jwtSecret,
      secretToken: environment.auth.secretToken,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        IdsClientConfig,
        XRoadConfig,
        ReykjavikUniversityApplicationClientConfig,
        UniversityOfIcelandApplicationClientConfig,
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
