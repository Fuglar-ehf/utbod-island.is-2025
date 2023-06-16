import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'

export const Comment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const [{ comment }, setStateful] = useStatefulAnswers(application)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('comment')}
    >
      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <DataValue
            label={formatMessage(
              oldAgePensionFormMessage.shared.commentSection,
            )}
            value=""
          />
          <DataValue label="" value={comment} />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
