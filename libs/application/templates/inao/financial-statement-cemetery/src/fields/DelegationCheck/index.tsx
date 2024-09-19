import { FieldBaseProps } from '@island.is/application/types'
import { AlertBanner, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { FinancialStatementCemetery } from '../../lib/dataSchema'
import { m } from '../../lib/messages'
import { VALIDATOR } from '../../utils/constants'

export const DelegationCheck = ({
  application,
  setBeforeSubmitCallback,
}: FieldBaseProps<FinancialStatementCemetery>) => {
  const { formatMessage } = useLocale()
  const {
    formState: { errors },
    setError,
  } = useFormContext()
  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      const userType = application.externalData.getUserType?.data
      const hasUserType = !!userType

      console.log('UserType: ', userType)

      if (hasUserType) {
        setError(VALIDATOR, {
          type: 'custom',
          message: formatMessage(m.wrongDelegation),
        })
        return [false, formatMessage(m.wrongDelegation)]
      } else {
        return [true, null]
      }
    })

  return errors && errors.validator ? (
    <Box paddingBottom={2} paddingTop={4}>
      <AlertBanner
        title={formatMessage(m.genericError)}
        description={formatMessage(m.wrongDelegation)}
        variant="error"
      />
    </Box>
  ) : null
}
