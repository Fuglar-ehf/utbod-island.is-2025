import React, { FC } from 'react'
import {
  Box,
  ButtonDeprecated as Button,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './Screen.treat'
import {
  Application,
  formatText,
  FormModes,
  FormText,
  SubmitField,
} from '@island.is/application/core'

interface FooterProps {
  application: Application
  mode?: FormModes
  activeScreenIndex: number
  numberOfScreens: number
  goBack: () => void
  submitField?: SubmitField
  loading: boolean
  canProceed: boolean
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
}) => {
  const { formatMessage } = useLocale()
  const hasSubmitField = submitField !== undefined
  const isLastScreen = activeScreenIndex === numberOfScreens - 1
  const showGoBack = activeScreenIndex > 0
  if (
    isLastScreen ||
    (mode !== FormModes.REVIEW && mode !== FormModes.APPLYING)
  ) {
    return null
  }

  function getSubmitButtonText(): FormText {
    if (submitField?.placement === 'footer') {
      const { actions } = submitField
      if (actions.length === 1) {
        return actions[0].name
      }
    }
    return {
      id: 'application.system:button.submit',
      defaultMessage: 'Submit',
      description: 'Submit button text',
    }
  }

  return (
    <Box marginTop={3} className={styles.buttonContainer}>
      <GridColumn
        span={['12/12', '12/12', '7/9', '7/9']}
        offset={['0', '0', '1/9']}
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="spaceBetween"
          paddingTop={[1, 4]}
          paddingBottom={[1, 5]}
        >
          <Box display={['none', 'inlineFlex']} padding={2} paddingLeft="none">
            {showGoBack && (
              <Button variant="ghost" onClick={goBack}>
                {formatMessage({
                  id: 'application.system:button.back',
                  defaultMessage: 'Til baka',
                  description: 'Back button text',
                })}
              </Button>
            )}
          </Box>
          <Box display={['inlineFlex', 'none']} padding={2} paddingLeft="none">
            {showGoBack && (
              <Button
                variant="ghost"
                rounded={true}
                icon="arrowLeft"
                onClick={goBack}
              />
            )}
          </Box>
          <Box display="inlineFlex" padding={2} paddingRight="none">
            {hasSubmitField ? (
              <Button
                loading={loading}
                disabled={!canProceed}
                htmlType="submit"
              >
                {formatText(getSubmitButtonText(), application, formatMessage)}
              </Button>
            ) : (
              <>
                <Box display={['none', 'inlineFlex']}>
                  <Button
                    loading={loading}
                    disabled={!canProceed}
                    icon="arrowRight"
                    htmlType="submit"
                  >
                    {formatMessage({
                      id: 'application.system:button.next',
                      defaultMessage: 'Halda áfram',
                      description: 'Next button text',
                    })}
                  </Button>
                </Box>
                <Box display={['inlineFlex', 'none']}>
                  <Button
                    loading={loading}
                    disabled={!canProceed}
                    icon="arrowRight"
                    htmlType="submit"
                    rounded
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </GridColumn>
    </Box>
  )
}

export default ScreenFooter
