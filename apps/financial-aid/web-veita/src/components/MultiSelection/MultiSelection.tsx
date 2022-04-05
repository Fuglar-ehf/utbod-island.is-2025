import React from 'react'
import { Box, Option, Select, Text, Icon } from '@island.is/island-ui/core'
import * as styles from './MultiSelection.css'

import { ValueType } from 'react-select'
import { ReactSelectOption } from '@island.is/financial-aid/shared/lib'

interface Props {
  options: Option[]
  active: Option[]
  onSelected: (value: ValueType<ReactSelectOption>) => void
  unSelected: (value: string, name: string) => void
}

const MultiSelection = ({ options, active, onSelected, unSelected }: Props) => {
  return (
    <Box display="block">
      <Box marginBottom={2}>
        {active.map((muni, index) => {
          return (
            <button
              key={'muni-tags-' + index}
              className={styles.tags}
              onClick={() => unSelected(muni.value as string, muni.label)}
            >
              <Box display="flex" alignItems="center" padding={1}>
                <Box marginRight={1}>
                  <Text color="blue400" fontWeight="semiBold" variant="small">
                    {muni.label}
                  </Text>
                </Box>

                <Icon icon="close" color="blue300" size="small" />
              </Box>
            </button>
          )
        })}
      </Box>

      <Select
        label="Sveitarfélög"
        name="selectMunicipality"
        noOptionsMessage="Enginn valmöguleiki"
        options={options}
        placeholder="Veldu tegund"
        onChange={onSelected}
        backgroundColor="blue"
      />
    </Box>
  )
}

export default MultiSelection
