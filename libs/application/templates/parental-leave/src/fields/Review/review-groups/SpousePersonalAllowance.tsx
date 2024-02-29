import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import { NO, YES } from '../../../constants'
import { getApplicationAnswers } from '../../../lib/parentalLeaveUtils'
import { ReviewGroupProps } from './props'
import { useLocale } from '@island.is/localization'

export const SpousePersonalAllowance = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    usePersonalAllowanceFromSpouse,
    spouseUseAsMuchAsPossible,
    spouseUsage,
  } = getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('personalAllowanceFromSpouse')}
    >
      <GridRow>
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
            <GridColumn
              span={['12/12', '12/12', '12/12', '5/12']}
              paddingTop={[2, 2, 2, 0]}
            >
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
            <GridColumn
              span={['12/12', '12/12', '12/12', '5/12']}
              paddingTop={[2, 2, 2, 0]}
            >
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
