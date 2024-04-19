import { Box, Icon, Text } from '@island.is/island-ui/core'
import * as styles from './Comments.css'
import { useLocale } from '@island.is/localization'
import { comments } from '../../lib/messages/comments'
import { countDaysAgo } from '../../lib/utils'
export type Props = {
  as?: 'div' | 'li'
  date?: string
  from?: string
  task?: string
  comment?: string
  type?: 'sent' | 'received'
}

export const Comment = ({
  as = 'li',
  date,
  from,
  task,
  comment,
  type,
}: Props) => {
  const Wrapper = as

  const { formatMessage } = useLocale()

  const daysAgo = date ? countDaysAgo(new Date(date)) : null

  const many = formatMessage(comments.dates.xDaysAgo, {
    days: daysAgo,
  })

  const yesterDay = formatMessage(comments.dates.yesterday)
  const today = formatMessage(comments.dates.today)

  const msg = daysAgo === 0 ? today : daysAgo === 1 ? yesterDay : many

  return (
    <Wrapper className={styles.comment}>
      <Box className={styles.iconColumn}>
        {type && (
          <Box className={styles.iconWrapper}>
            <Icon
              useStroke={true}
              icon={type === 'received' ? 'arrowForward' : 'arrowBack'}
              type="filled"
              color="white"
            />
          </Box>
        )}
      </Box>
      <Box className={styles.contentColumn}>
        {from && (
          <Text>
            <strong>{from}</strong> {task && `${task}`}
          </Text>
        )}
        <Text>{comment}</Text>
      </Box>
      <Box className={styles.dateColumn}>
        {daysAgo !== null && <Text truncate>{msg}</Text>}
      </Box>
    </Wrapper>
  )
}
