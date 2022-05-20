import { ServicePortalModule } from '@island.is/service-portal/core'
import { documentProviderModule } from '@island.is/service-portal/document-provider'
import { documentsModule } from '@island.is/service-portal/documents'
import { assetsModule } from '@island.is/service-portal/assets'
import { informationModule } from '@island.is/service-portal/information'
import { financeModule } from '@island.is/service-portal/finance'
import { financeScheduleModule } from '@island.is/service-portal/finance-schedule'
import { icelandicNamesRegistryModule } from '@island.is/service-portal/icelandic-names-registry'
import { personalInformationModule } from '@island.is/service-portal/settings/personal-information'
import { accessControlModule } from '@island.is/service-portal/settings/access-control'
import { educationModule } from '@island.is/service-portal/education'
import { educationLicenseModule } from '@island.is/service-portal/education-license'
import { petitionsModule } from '@island.is/service-portal/endorsements'
import { educationCareerModule } from '@island.is/service-portal/education-career'
import { educationStudentAssessmentModule } from '@island.is/service-portal/education-student-assessment'
import { applicationsModule } from '@island.is/service-portal/applications'
import { licensesModule } from '@island.is/service-portal/licenses'
import { vehiclesModule } from '@island.is/service-portal/vehicles'
/**
 * NOTE:
 * Modules should only be here if they are production ready
 * or if they are ready for beta testing. Modules that are ready
 * for beta testing should be feature flagged.
 *
 * To feature flag a module add it to the featureFlaggedModules below
 * and create a feature flag in ConfigCat called
 * `isServicePortalFinanceModuleEnabled` where your module is called `finance`.
 */

export type ModuleKeys =
  | 'accessControl'
  | 'documentProvider'
  | 'documents'
  | 'information'
  | 'finance'
  | 'financeSchedule'
  | 'icelandicNamesRegistry'
  | 'personalInformation'
  | 'education'
  | 'educationLicense'
  | 'educationCareer'
  | 'educationStudentAssessment'
  | 'assets'
  | 'applications'
  | 'licenses'
  | 'petitions'
  | 'vehicles'

export const featureFlaggedModules: ModuleKeys[] = [
  'accessControl',
  'documentProvider',
  'icelandicNamesRegistry',
  'personalInformation',
  'petitions',
  'financeSchedule',
  'vehicles',
]

export const companyModules: ModuleKeys[] = [
  'documents',
  'applications',
  'assets',
  'finance',
  'information',
  'vehicles',
  'personalInformation',

  // TODO: Next in:
  // 'licenses',
]

export const modules: Record<ModuleKeys, ServicePortalModule> = {
  documentProvider: documentProviderModule,
  documents: documentsModule,
  information: informationModule,
  finance: financeModule,
  financeSchedule: financeScheduleModule,
  icelandicNamesRegistry: icelandicNamesRegistryModule,
  personalInformation: personalInformationModule,
  education: educationModule,
  educationLicense: educationLicenseModule,
  petitions: petitionsModule,
  educationCareer: educationCareerModule,
  educationStudentAssessment: educationStudentAssessmentModule,
  assets: assetsModule,
  applications: applicationsModule,
  accessControl: accessControlModule,
  licenses: licensesModule,
  vehicles: vehiclesModule,
}
