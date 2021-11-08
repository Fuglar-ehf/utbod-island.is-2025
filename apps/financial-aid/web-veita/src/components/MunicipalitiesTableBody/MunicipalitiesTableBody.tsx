import React from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import cn from 'classnames'

import { Municipality } from '@island.is/financial-aid/shared/lib'
import Link from 'next/link'

interface PageProps {
  municipality: Municipality
  index: number
}

const MunicipalitiesTableBody = ({ municipality, index }: PageProps) => {
  return (
    <Link href={'sveitarfelog/' + municipality.id}>
      <tr
        className={`${tableStyles.link} contentUp`}
        style={{ animationDelay: 55 + 3.5 * index + 'ms' }}
      >
        <td
          className={cn({
            [`${tableStyles.tablePadding} ${tableStyles.firstChildPadding}`]: true,
          })}
        >
          <Box>
            <Text
              variant="h5"
              color={municipality.active ? 'dark400' : 'dark300'}
            >
              {municipality.name}
            </Text>
          </Box>
        </td>
        <td
          className={cn({
            [`${tableStyles.tablePadding} `]: true,
          })}
        >
          <Box>
            <Text color={municipality.active ? 'dark400' : 'dark300'}>
              {municipality.users}
            </Text>
          </Box>
        </td>
        <td
          className={cn({
            [`${tableStyles.tablePadding} `]: true,
          })}
        >
          <Button
            onClick={(event) => {
              event.stopPropagation()
            }}
            variant="text"
            loading={false}
            colorScheme={municipality.active ? 'destructive' : 'light'}
          >
            {municipality.active ? 'Óvirkja' : 'Virkja'}
          </Button>
        </td>
      </tr>
    </Link>
  )
}

export default MunicipalitiesTableBody
