import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Button, ButtonTypes, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText, coreMessages } from '@island.is/application/core'
import {
  Application,
  FormModes,
  SubmitField,
  CallToAction,
} from '@island.is/application/types'

import * as styles from './ScreenFooter.css'

interface FooterProps {
  application: Application
  mode?: FormModes
  activeScreenIndex: number
  numberOfScreens: number
  goBack: () => void
  submitField?: SubmitField
  loading: boolean
  canProceed: boolean
  renderLastScreenButton?: boolean
  renderLastScreenBackButton?: boolean
}

type SubmitButton = Omit<ButtonTypes, 'circle'> & {
  icon?: 'checkmark' | 'close' | 'pencil'
}

const submitButtonConfig: Record<CallToAction['type'], SubmitButton> = {
  primary: {
    icon: 'checkmark',
    colorScheme: 'default',
    variant: 'primary',
  },
  sign: {
    icon: 'pencil',
    colorScheme: 'default',
    variant: 'primary',
  },
  subtle: {
    colorScheme: 'light',
    variant: 'ghost',
  },
  reject: {
    icon: 'close',
    colorScheme: 'destructive',
    variant: 'primary',
  },
}

export const ScreenFooter: FC<FooterProps> = ({
  activeScreenIndex,
  application,
  canProceed,
  goBack,
  loading,
  mode,
  numberOfScreens,
  submitField,
  renderLastScreenButton,
  renderLastScreenBackButton,
}) => {
  const { formatMessage } = useLocale()
  const history = useHistory()
  const hasSubmitField = submitField !== undefined
  const isLastScreen = activeScreenIndex === numberOfScreens - 1
  const showGoBack =
    activeScreenIndex > 0 && (!isLastScreen || renderLastScreenBackButton)

  if (
    (isLastScreen && !renderLastScreenButton) ||
    (mode !== FormModes.REVIEW &&
      mode !== FormModes.APPLYING &&
      mode !== FormModes.EDITING)
  ) {
    return null
  }

  function renderSubmitButtons() {
    if (!submitField || submitField.placement === 'screen') {
      return (
        <Button
          icon="checkmarkCircle"
          data-testid={submitField?.dataTestId}
          loading={!canProceed || loading}
          type="submit"
        >
          {formatText(coreMessages.buttonSubmit, application, formatMessage)}
        </Button>
      )
    }

    return submitField?.actions
      .filter(({ condition }) =>
        typeof condition === 'function'
          ? condition(application.answers, application.externalData)
          : true,
      )
      .map(({ event, type, name, dataTestId }, idx) => {
        const buttonConfig = submitButtonConfig[type]

        return (
          <Box key={`cta-${event}`} marginLeft={idx === 0 ? 0 : 2}>
            <Button
              type="submit"
              loading={!canProceed || loading}
              colorScheme={buttonConfig.colorScheme as any}
              data-testid={dataTestId}
              id={typeof event === 'object' ? event.type : event}
              variant={buttonConfig.variant}
              icon={buttonConfig.icon}
            >
              {formatText(name, application, formatMessage)}
            </Button>
          </Box>
        )
      })
  }

  return (
    <Box marginTop={7} className={styles.buttonContainer}>
      <GridColumn
        span={['12/12', '12/12', '10/12', '7/9']}
        offset={['0', '0', '1/12', '1/9']}
      >
        <Box
          display="flex"
          flexDirection="rowReverse"
          alignItems="center"
          justifyContent="spaceBetween"
          paddingTop={[1, 4]}
        >
          <Box display="inlineFlex" padding={2} paddingRight="none">
            {hasSubmitField ? (
              renderSubmitButtons()
            ) : isLastScreen ? (
              <Box display="inlineFlex">
                <Button
                  loading={loading}
                  onClick={() => history.push('/minarsidur')}
                  icon="arrowForward"
                  data-testid="applications-home"
                  type="button"
                >
                  {formatMessage({
                    id: 'application.system:button.servicePortal',
                    defaultMessage: 'Back to Service Portal',
                    description: 'Service Portal button text',
                  })}
                </Button>
              </Box>
            ) : (
              <Box display="inlineFlex">
                <Button
                  loading={!canProceed || loading}
                  icon="arrowForward"
                  data-testid="proceed"
                  type="submit"
                >
                  {formatMessage(coreMessages.buttonNext)}
                </Button>
              </Box>
            )}
          </Box>
          <Box display={['none', 'inlineFlex']} padding={2} paddingLeft="none">
            {showGoBack && (
              <Button
                variant="ghost"
                data-testid="step-back"
                onClick={goBack}
                disabled={!canProceed || loading}
              >
                {formatMessage(coreMessages.buttonBack)}
              </Button>
            )}
          </Box>
          <Box display={['inlineFlex', 'none']} padding={2} paddingLeft="none">
            {showGoBack && (
              <Button
                circle
                data-testid="step-back"
                variant="ghost"
                icon="arrowBack"
                onClick={goBack}
                disabled={!canProceed || loading}
              />
            )}
          </Box>
        </Box>
      </GridColumn>
    </Box>
  )
}

export default ScreenFooter
