import { Injectable } from '@nestjs/common'
import { FishingLicence, Ship } from './types'

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
        seaworthiness: { validTo: new Date() },
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
        seaworthiness: { validTo: new Date() },
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
        seaworthiness: { validTo: new Date() },
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
        name: 'aflamark',
        reasons: [{ description: 'test', directions: 'fulla ferð áfram' }],
      },
      {
        answer: true,
        name: 'krókaflamark',
        reasons: [{ description: 'test', directions: 'fulla ferð áfram' }],
      },
      {
        answer: true,
        name: 'sérleyfi 1',
        reasons: [{ description: 'test', directions: 'fulla ferð áfram' }],
      },
    ]
  }
}
