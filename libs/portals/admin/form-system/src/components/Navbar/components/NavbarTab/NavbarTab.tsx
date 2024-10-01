import { Box, Inline } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './NavbarTab.css'
import { useContext } from 'react'
import { baseSettingsStep } from '../../../../lib/utils/getBaseSettingsSection'
import { ControlContext } from '../../../../context/ControlContext'
import { useIntl } from 'react-intl'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { m } from '@island.is/form-system/ui'
import { FormSystemSectionDtoSectionTypeEnum } from '@island.is/api/schema'

export const NavbarTab = () => {
  const { control, controlDispatch, inSettings, setInSettings } =
    useContext(ControlContext)
  const { sections } = control.form
  const { formatMessage } = useIntl()
  return (
    <Box display="flex" flexDirection="row">
      <Inline space={4}>
        <Box
          className={cn({
            [styles.notSelected]: inSettings,
            [styles.selected]: !inSettings,
          })}
          onClick={() => {
            const section = sections?.find((s) => s?.sectionType === FormSystemSectionDtoSectionTypeEnum.Input)
            controlDispatch({
              type: 'SET_ACTIVE_ITEM',
              payload: {
                activeItem: {
                  type: 'Section',
                  data: section,
                },
              },
            })
            setInSettings(false)
          }}
        >
          {formatMessage(m.step)}
        </Box>
        <Box
          className={cn({
            [styles.notSelected]: !inSettings,
            [styles.selected]: inSettings,
          })}
          onClick={() => {
            controlDispatch({
              type: 'SET_ACTIVE_ITEM',
              payload: {
                activeItem: {
                  type: 'Section',
                  data: baseSettingsStep,
                },
              },
            })
            setInSettings(true)
          }}
        >
          {formatMessage(m.basicSettings)}
        </Box>
      </Inline>
    </Box>
  )
}
