import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { Locale } from '@island.is/shared/types'
import { i18n } from '../../utils/translations'
import { OrorkuSkirteini } from '@island.is/clients/disability-license'

export const parseDisabilityLicensePayload = (
  license: OrorkuSkirteini,
  locale: Locale = 'is',
  labels?: GenericLicenseLabels,
): GenericUserLicensePayload | null => {
  if (!license) return null
  const label = labels?.labels
  const data: Array<GenericLicenseDataField> = [
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'Grunnupplýsingar örorkuskírteinis',
      label: label ? label['fullName'] : i18n.fullName[locale],
      value: license.nafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['publisher'] : i18n.publisher[locale],
      value: 'Tryggingastofnun',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['validTo'] : i18n.validTo[locale],
      value: license.gildirtil?.toISOString() ?? '',
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
    metadata: {
      licenseNumber: license.kennitala?.toString() ?? '',
      expired: license.gildirtil
        ? !isAfter(new Date(license.gildirtil), new Date())
        : null,
    },
  }
}

const formatDateString = (dateTime: Date) => {
  return dateTime ? format(dateTime, 'dd.MM.yyyy') : ''
}

export const createPkPassDataInput = (license: OrorkuSkirteini) => {
  if (!license) return null

  return [
    {
      identifier: 'name',
      value: license.nafn ?? '',
    },
    {
      identifier: 'kennitala',
      value: license.kennitala ?? '',
    },
    {
      identifier: 'gildir',
      value: license.gildirtil ? formatDateString(license.gildirtil) : '',
    },
  ]
}
