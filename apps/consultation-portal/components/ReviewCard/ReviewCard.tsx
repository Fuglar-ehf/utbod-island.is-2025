import {
  FocusableBox,
  Icon,
  Inline,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { SimpleCardSkeleton } from '../Card'
import { useState } from 'react'
import * as styles from './ReviewCard.css'
import { getShortDate } from '../../utils/helpers/dateFormatter'

export const ReviewCard = ({ advice }) => {
  const [open, setOpen] = useState(false)

  return (
    <SimpleCardSkeleton>
      <Stack space={1}>
        <Inline justifyContent="spaceBetween" flexWrap="nowrap" alignY="center">
          <Text variant="eyebrow" color="purple400">
            {getShortDate(advice.created)}
          </Text>
          {advice.content && advice.content.length > 50 && (
            <FocusableBox onClick={() => setOpen(!open)}>
              <Icon
                icon={open ? 'close' : 'open'}
                type="outline"
                size="small"
                color="blue400"
              />
            </FocusableBox>
          )}
        </Inline>
        <Text variant="h3">
          {advice?.number} - {advice?.participantName}
        </Text>
        <Text variant="default" truncate={!open}>
          {advice.content}
        </Text>
        {advice?.adviceDocuments &&
          advice?.adviceDocuments.length > 0 &&
          advice?.adviceDocuments.map((doc, index) => {
            return (
              <LinkV2
                href={`https://samradapi-test.island.is/api/Documents/${doc.id}`}
                color="blue400"
                underline="normal"
                underlineVisibility="always"
                newTab
                key={index}
              >
                {doc.fileName}
                <Icon
                  aria-hidden="true"
                  icon="document"
                  type="outline"
                  className={styles.iconStyle}
                />
              </LinkV2>
            )
          })}
      </Stack>
    </SimpleCardSkeleton>
  )
}

export default ReviewCard
