import {
  DataValue,
  Label,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { ReviewGroupProps } from './props'
import { useLocale } from '@island.is/localization'
import { NO, YES, parentalLeaveFormMessages } from '../../..'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { EmployersTable } from '../../components/EmployersTable'

export const Employment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const [
    {
      isSelfEmployed,
      isReceivingUnemploymentBenefits,
      unemploymentBenefits,
      employers,
    },
  ] = useStatefulAnswers(application)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('isSelfEmployed.benefits')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <RadioValue
            label={formatMessage(parentalLeaveFormMessages.selfEmployed.title)}
            value={isSelfEmployed}
          />
        </GridColumn>
      </GridRow>
      {isSelfEmployed === NO && ( // only show benefits in review if user had to answer that question
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <Box paddingTop={2} paddingBottom={2}>
              <RadioValue
                label={formatMessage(
                  parentalLeaveFormMessages.employer
                    .isReceivingUnemploymentBenefitsTitle,
                )}
                value={isReceivingUnemploymentBenefits}
              />
            </Box>
          </GridColumn>

          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            {isReceivingUnemploymentBenefits === YES && (
              <Box paddingTop={2} paddingBottom={2}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.employer.unemploymentBenefits,
                  )}
                  value={unemploymentBenefits}
                />
              </Box>
            )}
          </GridColumn>
        </GridRow>
      )}
      {isSelfEmployed === NO && isReceivingUnemploymentBenefits === NO && (
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <Label>
              {formatMessage(parentalLeaveFormMessages.employer.title)}
            </Label>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            {employers?.length > 0 && (
              <Box paddingTop={2}>
                <EmployersTable employers={employers} />
              </Box>
            )}
          </GridColumn>
        </GridRow>
      )}
    </ReviewGroup>
  )
}
