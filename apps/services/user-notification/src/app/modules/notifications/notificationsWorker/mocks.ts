import faker from 'faker'

import { UserProfileDto } from '@island.is/clients/user-profile'
import { createNationalId } from '@island.is/testing/fixtures'
import { DelegationRecordDTO } from '@island.is/clients/auth/delegation-api'
import { Features } from '@island.is/feature-flags'
import type { User } from '@island.is/auth-nest-tools'
import type { ConfigType } from '@island.is/nest/config'

import { UserNotificationsConfig } from '../../../../config'
import { HnippTemplate } from '../dto/hnippTemplate.response'

export const mockFullName = 'mockFullName'
export const delegationSubjectId = 'delegation-subject-id'

interface MockUserProfileDto extends UserProfileDto {
  name: string
}

export const userWithDelegations: MockUserProfileDto = {
  name: 'userWithDelegations',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
}

export const userWithDelegations2: MockUserProfileDto = {
  name: 'userWithDelegations2',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email5@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
}

export const userWithNoDelegations: MockUserProfileDto = {
  name: 'userWithNoDelegations',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email1@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
}

export const userWithEmailNotificationsDisabled: MockUserProfileDto = {
  name: 'userWithEmailNotificationsDisabled',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: false,
  isRestricted: false,
}

export const userWithDocumentNotificationsDisabled: MockUserProfileDto = {
  name: 'userWithDocumentNotificationsDisabled',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email2@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: false,
  emailNotifications: true,
  isRestricted: false,
}

export const userWithFeatureFlagDisabled: MockUserProfileDto = {
  name: 'userWithFeatureFlagDisabled',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email3@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
}

export const userWithSendToDelegationsFeatureFlagDisabled: MockUserProfileDto =
  {
    name: 'userWithSendToDelegationsFeatureFlagDisabled',
    nationalId: createNationalId('person'),
    mobilePhoneNumber: '1234567',
    email: 'email4@email.com',
    emailVerified: true,
    mobilePhoneNumberVerified: true,
    documentNotifications: true,
    emailNotifications: true,
    isRestricted: false,
  }

export const mockTemplateId = 'HNIPP.DEMO.ID'

export const getMockHnippTemplate = ({
  templateId = mockTemplateId,
  notificationTitle = 'Demo title ',
  notificationBody = 'Demo body {{arg1}}',
  notificationDataCopy = 'Demo data copy',
  clickActionUrl = 'https://island.is/minarsidur/postholf',
  category = 'Demo category',
  args = ['arg1', 'arg2'],
}: Partial<HnippTemplate>): HnippTemplate => ({
  templateId,
  notificationTitle,
  notificationBody,
  notificationDataCopy,
  clickActionUrl,
  category,
  args,
})

export const userProfiles = [
  userWithDelegations,
  userWithDelegations2,
  userWithNoDelegations,
  userWithEmailNotificationsDisabled,
  userWithDocumentNotificationsDisabled,
  userWithFeatureFlagDisabled,
  userWithSendToDelegationsFeatureFlagDisabled,
]

const delegations: Record<string, DelegationRecordDTO[]> = {
  [userWithDelegations.nationalId]: [
    {
      fromNationalId: userWithDelegations.nationalId,
      toNationalId: userWithNoDelegations.nationalId,
      subjectId: null, // test that 3rd party login is not used if subjectId is null
    },
  ],
  [userWithDelegations2.nationalId]: [
    {
      fromNationalId: userWithDelegations2.nationalId,
      toNationalId: userWithDelegations.nationalId,
      subjectId: delegationSubjectId,
    },
  ],
  [userWithSendToDelegationsFeatureFlagDisabled.nationalId]: [
    {
      fromNationalId: userWithSendToDelegationsFeatureFlagDisabled.nationalId,
      toNationalId: userWithNoDelegations.nationalId,
      subjectId: faker.datatype.uuid(),
    },
  ],
}

export class MockDelegationsService {
  delegationsControllerGetDelegationRecords({
    xQueryNationalId,
  }: {
    xQueryNationalId: string
  }) {
    return { data: delegations[xQueryNationalId] ?? [] }
  }
}

export class MockFeatureFlagService {
  getValue(feature: Features, _defaultValue: boolean | string, user?: User) {
    if (feature === Features.isNotificationEmailWorkerEnabled) {
      return user?.nationalId !== userWithFeatureFlagDisabled.nationalId
    }

    if (feature === Features.shouldSendEmailNotificationsToDelegations) {
      return (
        user?.nationalId !==
        userWithSendToDelegationsFeatureFlagDisabled.nationalId
      )
    }

    return true
  }
}

export class MockNationalRegistryV3ClientService {
  getName(nationalId: string) {
    const user = userProfiles.find((u) => u.nationalId === nationalId)

    return {
      fulltNafn: user?.name ?? mockFullName,
    }
  }
}

export const MockUserNotificationsConfig: ConfigType<
  typeof UserNotificationsConfig
> = {
  isWorker: true,
  firebaseCredentials: 'firebase-credentials',
  contentfulAccessToken: 'contentful-access-token',
  emailFromAddress: 'development@island.is',
  isConfigured: true,
  servicePortalClickActionUrl: 'https://island.is/minarsidur',
  redis: {
    nodes: ['node'],
    ssl: false,
  },
}
