import { Injectable } from '@nestjs/common'
import { FishingLicence, FishingLicenseCodeType, Ship } from './types'

export interface FishingLicenseClient {
  getShips: (nationalId: string) => Ship[]
  getFishingLicenses: (registrationNubmer: number) => FishingLicence[]
}

export const FISHING_LICENSE_CLIENT = 'FishingLicenseClient'

@Injectable()
export class FishingLicenceApiClientMock implements FishingLicenseClient {
  getShips(nationalId: string): Ship[] {
    return [
      {
        name: 'Hólmsteinn',
        registrationNumber: 2355,
        grossTons: 33,
        length: 240,
        homePort: 'Grindavík',
        seaworthiness: { validTo: new Date('21 Aug 2022 00:12:00 GMT') },
        deprivations: [],
        features: '',
        fishingLicences: ['Aflamark'],
      },
      {
        name: 'Skip tvö',
        registrationNumber: 123123,
        grossTons: 33,
        length: 240,
        homePort: 'Hafnafjörður',
        seaworthiness: { validTo: new Date('23 Jan 2021 00:12:00 GMT') },
        deprivations: [],
        features: '',
        fishingLicences: ['Krókaflamark', 'Sérleyfi 123'],
      },
      {
        name: 'Lítill bátur',
        registrationNumber: 1,
        grossTons: 1,
        length: 10,
        homePort: 'Hafnarfjörður',
        seaworthiness: { validTo: new Date('23 Feb 2022 00:12:00 GMT') },
        deprivations: [],
        features: '',
        fishingLicences: [],
      },
    ]
  }

  getFishingLicenses(registrationNumber: number): FishingLicence[] {
    return [
      {
        answer: true,
        fishingLicenseInfo: {
          code: FishingLicenseCodeType.catchMark,
          name: 'aflamark',
        },
        reasons: [
          {
            description: 'Some reason what not',
            directions: 'Einungis er heimilt að nýta ...',
          },
        ],
      },
      {
        answer: true,
        fishingLicenseInfo: {
          code: FishingLicenseCodeType.hookCatchLimit,
          name: 'krókaflamark',
        },
        reasons: [
          {
            description: 'Other reason what not you know',
            directions:
              'Einungis er heimilt að nýta handfæri og línu með krókaveiðifærum. Báturinn þarf að vera 15 brúttótonn eða minna.',
          },
        ],
      },
    ]
  }
}
