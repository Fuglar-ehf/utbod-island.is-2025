import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { NO, YES, parentalLeaveFormMessages } from '../../..'
import { ReviewGroupProps } from './props'
import { useLocale } from '@island.is/localization'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'

export const SpousePersonalAllowance = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const [
    { usePersonalAllowanceFromSpouse, spouseUseAsMuchAsPossible, spouseUsage },
  ] = useStatefulAnswers(application)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('personalAllowanceFromSpouse')}
    >
      <GridRow marginBottom={2}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <RadioValue
            label={formatMessage(
              parentalLeaveFormMessages.personalAllowance.spouseTitle,
            )}
            value={usePersonalAllowanceFromSpouse}
          />
        </GridColumn>

        {usePersonalAllowanceFromSpouse === YES &&
          spouseUseAsMuchAsPossible === YES && (
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <RadioValue
                label={formatMessage(
                  parentalLeaveFormMessages.reviewScreen
                    .useSpousePersonalAllowance,
                )}
                value={spouseUseAsMuchAsPossible}
              />
            </GridColumn>
          )}

        {usePersonalAllowanceFromSpouse === YES &&
          spouseUseAsMuchAsPossible === NO && (
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.personalAllowance.allowanceUsage,
                )}
                value={`${spouseUsage ?? 0}%`}
              />
            </GridColumn>
          )}
      </GridRow>
    </ReviewGroup>
  )
}
