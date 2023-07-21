import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { getApplicationExternalData } from '../../../lib/oldAgePensionUtils'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { formatNumber } from 'libphonenumber-js'
import { useFormContext } from 'react-hook-form'

export const BaseInformation = ({
  application,
  editable,
  groupHasNoErrors,
  hasError,
}: ReviewGroupProps) => {
  const [
    { applicantEmail, applicantPhonenumber },
    setStateful,
  ] = useStatefulAnswers(application)

  const {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    spouseName,
    spouseNationalId,
  } = getApplicationExternalData(application.externalData)

  const { formatMessage } = useLocale()
  const { getValues } = useFormContext()

  const phonenumber = getValues('applicantInfo.phonenumber')

  return (
    <ReviewGroup
      isEditable={editable}
      canCloseEdit={groupHasNoErrors([
        'applicantInfo.email',
        'applicantInfo.phonenumber',
      ])}
      editChildren={
        <Box marginTop={[8, 8, 8, 0]}>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '7/12']}
              paddingBottom={3}
            >
              <InputController
                id="applicantInfo.email"
                name="applicantInfo.email"
                defaultValue={applicantEmail}
                type="email"
                backgroundColor="blue"
                label={formatMessage(oldAgePensionFormMessage.review.email)}
                onChange={(e) =>
                  setStateful((prev) => ({
                    ...prev,
                    applicantEmail: e.target.value,
                  }))
                }
                error={hasError('applicantInfo.email')}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
              <PhoneInputController
                id="applicantInfo.phonenumber"
                name="applicantInfo.phonenumber"
                defaultValue={applicantPhonenumber}
                backgroundColor="blue"
                label={formatMessage(
                  oldAgePensionFormMessage.review.phonenumber,
                )}
                onChange={(e) => {
                  setStateful((prev) => ({
                    ...prev,
                    applicantPhonenumber: e.target.value,
                  }))
                }}
                error={hasError('applicantInfo.phonenumber')}
              />
            </GridColumn>
          </GridRow>
        </Box>
      }
      triggerValidation
    >
      {applicantName !== '' && (
        <GridRow marginBottom={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(oldAgePensionFormMessage.review.name)}
              value={applicantName}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(oldAgePensionFormMessage.review.nationalId)}
              value={formatKennitala(applicantNationalId)}
            />
          </GridColumn>
        </GridRow>
      )}

      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.address)}
            value={applicantAddress}
          />
        </GridColumn>

        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.municipality)}
            value={applicantMunicipality}
          />
        </GridColumn>
      </GridRow>

      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.email)}
            value={applicantEmail}
            error={hasError('applicantInfo.email')}
          />
        </GridColumn>

        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.phonenumber)}
            value={formatNumber(phonenumber, 'International')}
            error={hasError('applicantInfo.phonenumber')}
          />
        </GridColumn>
      </GridRow>

      {spouseName && (
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(oldAgePensionFormMessage.review.spouseName)}
              value={spouseName}
            />
          </GridColumn>

          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(oldAgePensionFormMessage.review.nationalId)}
              value={formatKennitala(spouseNationalId)}
            />
          </GridColumn>
        </GridRow>
      )}
    </ReviewGroup>
  )
}
