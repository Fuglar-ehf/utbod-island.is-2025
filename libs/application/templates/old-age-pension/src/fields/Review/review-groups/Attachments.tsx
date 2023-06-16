import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import {
  GridColumn,
  GridRow,
  BulletList,
  Text,
  Bullet,
} from '@island.is/island-ui/core'
import { ReviewGroupProps } from './props'
import { useLocale } from '@island.is/localization'

import { getAttachments } from '../../../lib/oldAgePensionUtils'
import { oldAgePensionFormMessage } from '../../../lib/messages'

export const Attachments = ({ application }: ReviewGroupProps) => {
  const { formatMessage } = useLocale()

  const attachments = getAttachments(application.answers)

  return (
    <>
      {attachments.length > 0 && (
        <ReviewGroup isLast={true}>
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <DataValue
                label={formatMessage(oldAgePensionFormMessage.fileUpload.title)}
                value=""
              />
              <BulletList type="ul">
                {attachments.map((attch) => {
                  return (
                    <Bullet>
                      <Text>{attch}</Text>
                    </Bullet>
                  )
                })}
              </BulletList>
            </GridColumn>
          </GridRow>
        </ReviewGroup>
      )}
    </>
  )
}
