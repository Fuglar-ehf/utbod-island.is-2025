import { GenericUserLicensePkPassStatus } from '../../licenceService.type'
import { GenericDrivingLicenseApi } from './drivingLicenseService.api'
import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'

describe('license-service/client/driving-license', () => {
  // Since the client needs to be refactored out of the service, test the
  // logic independantly via the static method
  // See readme for rules
  describe('pkpass status', () => {
    it('should be unknown for empty license', async () => {
      const license: GenericDrivingLicenseResponse = {}

      const result = GenericDrivingLicenseApi.licenseIsValidForPkpass(license)

      expect(result).toBe(GenericUserLicensePkPassStatus.Unknown)
    })

    it('should be valid for a license with a `mynd`', () => {
      const license: GenericDrivingLicenseResponse = {
        mynd: {
          mynd: 'not-empty',
          skrad: '1997-08-14T00:00:00',
        },
      }

      const result = GenericDrivingLicenseApi.licenseIsValidForPkpass(license)

      expect(result).toBe(GenericUserLicensePkPassStatus.Available)
    })

    it('should not be available for a license with `mynd` as null', () => {
      const license: GenericDrivingLicenseResponse = {
        mynd: null,
      }

      const result = GenericDrivingLicenseApi.licenseIsValidForPkpass(license)

      expect(result).toBe(GenericUserLicensePkPassStatus.NotAvailable)
    })
  })
})
