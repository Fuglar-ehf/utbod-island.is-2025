import React from 'react'
import { Text, Box, Link } from '@island.is/island-ui/core'

import * as styles from './Profile.treat'
import cn from 'classnames'

interface Props {
  heading: string
  info: {
    title: string
    content?: string
    link?: string
    other?: string
  }[]
  className?: string
}

const Profile: React.FC<Props> = ({ heading, info, className }) => {
  return (
    <>
      {' '}
      <Box
        className={cn({
          [`${styles.headings}`]: true,
          [`${className}`]: true,
        })}
        marginBottom={[2, 2, 3]}
      >
        <Text as="h2" variant="h3" color="dark300">
          {heading}
        </Text>
      </Box>
      <div
        className={cn({
          [`${styles.container}`]: true,
          [`${className}`]: true,
        })}
      >
        {info.map((item, index) => {
          return (
            <Box key={'profile-' + index}>
              <Text variant="eyebrow" marginBottom={1}>
                {item.title}
              </Text>

              {item.link ? (
                <Link href={item.link} color="blue400">
                  {item.content}
                </Link>
              ) : (
                <Text>{item.content}</Text>
              )}

              {item.other && (
                <Box
                  background="blue100"
                  borderRadius="large"
                  padding={2}
                  marginTop={1}
                >
                  <Text variant="small">
                    „<em>{item.other}</em>“
                  </Text>
                </Box>
              )}
            </Box>
          )
        })}
      </div>
    </>
  )
}

export default Profile
