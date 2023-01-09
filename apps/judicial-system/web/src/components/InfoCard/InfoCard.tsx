import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import {
  Defendant,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import { formatDOB } from '@island.is/judicial-system/formatters'

import * as styles from './InfoCard.css'

interface Defender {
  name: string
  defenderNationalId?: string
  sessionArrangement?: SessionArrangements
  email?: string
  phoneNumber?: string
}

interface UniqueDefendersProps {
  defenders: Defender[]
}

interface Props {
  data: Array<{ title: string; value?: React.ReactNode }>
  defendants?: { title: string; items: Defendant[] }
  defenders?: Defender[]
}

const UniqueDefenders: React.FC<UniqueDefendersProps> = (props) => {
  const { defenders } = props
  const uniqueDefenders = defenders?.filter(
    (defender, index, self) =>
      index === self.findIndex((d) => d.email === defender.email),
  )

  return (
    <>
      <Text variant="h4">
        {defenders[0].sessionArrangement ===
        SessionArrangements.ALL_PRESENT_SPOKESPERSON
          ? 'Talsmaður'
          : `Verj${uniqueDefenders.length > 1 ? 'endur' : 'andi'}`}
      </Text>
      {uniqueDefenders.map((defender) =>
        defender?.name ? (
          <Box display="flex">
            <Text>
              {`${defender.name}${defender.email ? `, ${defender.email}` : ''}${
                defender.phoneNumber ? `, s. ${defender.phoneNumber}` : ''
              }`}
            </Text>
          </Box>
        ) : (
          <Text>Hefur ekki verið skráður</Text>
        ),
      )}
    </>
  )
}

const InfoCard: React.FC<Props> = (props) => {
  const { data, defendants, defenders } = props

  return (
    <Box
      className={styles.infoCardContainer}
      padding={[2, 2, 3, 3]}
      data-testid="infoCard"
    >
      <Box
        className={styles.infoCardTitleContainer}
        marginBottom={[2, 2, 3, 3]}
        paddingBottom={[2, 2, 3, 3]}
      >
        {defendants && (
          <>
            <Text variant="h4">{defendants.title}</Text>
            <Box marginBottom={defenders ? [2, 2, 3, 3] : 0}>
              {defendants.items.map((defendant) => (
                <Text key={defendant.id}>
                  <span className={styles.infoCardDefendant}>
                    <Text
                      as="span"
                      fontWeight="semiBold"
                    >{`${defendant.name}, `}</Text>
                    <Text as="span" fontWeight="semiBold">
                      {defendant.nationalId
                        ? `${formatDOB(
                            defendant.nationalId,
                            defendant.noNationalId,
                          )}, `
                        : ''}
                    </Text>
                    <Text as="span">
                      {defendant.citizenship && ` (${defendant.citizenship}), `}
                    </Text>
                    {defendant.address && (
                      <Text as="span">{`${defendant.address}`}</Text>
                    )}
                  </span>
                </Text>
              ))}
            </Box>
          </>
        )}
        {defenders && <UniqueDefenders defenders={defenders} />}
      </Box>
      <Box className={styles.infoCardDataContainer}>
        {data.map((dataItem, index) => {
          return (
            <Box data-testid={`infoCardDataContainer${index}`} key={index}>
              <Text variant="h4">{dataItem.title}</Text>
              {typeof dataItem.value === 'string' ? (
                <Text>{dataItem.value}</Text>
              ) : (
                dataItem.value
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default InfoCard
