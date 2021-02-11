import React, { FC, useReducer } from 'react'
import cn from 'classnames'
import {
  Application,
  Form,
  FormModes,
  Schema,
} from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'

import Screen from '../components/Screen'
import FormStepper from '../components/FormStepper'
import {
  ApplicationReducer,
  initializeReducer,
} from '../reducer/ApplicationFormReducer'
import { ActionTypes } from '../reducer/ReducerTypes'
import * as styles from './FormShell.treat'
import ErrorBoundary from '../components/ErrorBoundary'
import { useHistorySync } from '../hooks/useHistorySync'
import { useApplicationTitle } from '../hooks/useApplicationTitle'

export const FormShell: FC<{
  application: Application
  nationalRegistryId: string
  form: Form
  dataSchema: Schema
}> = ({ application, nationalRegistryId, form, dataSchema }) => {
  const [state, dispatch] = useReducer(
    ApplicationReducer,
    {
      application,
      nationalRegistryId,
      dataSchema,
      form,
      activeScreen: 0,
      screens: [],
      sections: [],
      historyReason: 'initial',
    },
    initializeReducer,
  )
  useHistorySync(state, dispatch)
  useApplicationTitle(state)
  const {
    activeScreen,
    application: storedApplication,
    sections,
    screens,
  } = state

  const { mode = FormModes.APPLYING, renderLastScreenButton } = state.form
  const showProgressTag = mode !== FormModes.APPLYING

  const currentScreen = screens[activeScreen]
  const FormLogo = form.logo

  return (
    <Box
      className={cn(styles.root, {
        [styles.rootApplying]: mode === FormModes.APPLYING,
        [styles.rootApproved]: mode === FormModes.APPROVED,
        [styles.rootPending]: mode === FormModes.PENDING,
        [styles.rootReviewing]: mode === FormModes.REVIEW,
        [styles.rootRejected]: mode === FormModes.REJECTED,
      })}
    >
      <Box
        paddingTop={[0, 4]}
        paddingBottom={[0, 5]}
        width="full"
        height="full"
      >
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '9/12', '9/12']}
              className={styles.shellContainer}
            >
              <Box
                paddingTop={[3, 6, 8]}
                height="full"
                borderRadius="large"
                background="white"
              >
                <ErrorBoundary
                  application={application}
                  currentScreen={currentScreen}
                >
                  <Screen
                    application={storedApplication}
                    addExternalData={(payload) =>
                      dispatch({ type: ActionTypes.ADD_EXTERNAL_DATA, payload })
                    }
                    answerQuestions={(payload) =>
                      dispatch({ type: ActionTypes.ANSWER, payload })
                    }
                    dataSchema={dataSchema}
                    expandRepeater={() =>
                      dispatch({ type: ActionTypes.EXPAND_REPEATER })
                    }
                    answerAndGoToNextScreen={(payload) =>
                      dispatch({
                        type: ActionTypes.ANSWER_AND_GO_NEXT_SCREEN,
                        payload,
                      })
                    }
                    goToScreen={(payload: string) => {
                      dispatch({
                        type: ActionTypes.GO_TO_SCREEN,
                        payload,
                      })
                    }}
                    prevScreen={() =>
                      dispatch({ type: ActionTypes.PREV_SCREEN })
                    }
                    activeScreenIndex={activeScreen}
                    numberOfScreens={screens.length}
                    renderLastScreenButton={renderLastScreenButton}
                    screen={currentScreen}
                    mode={mode}
                  />
                </ErrorBoundary>
              </Box>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '3/12', '3/12']}
              className={styles.sidebarContainer}
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="spaceBetween"
                height="full"
                paddingTop={[0, 0, 8]}
                paddingLeft={[0, 0, 0, 4]}
                className={styles.sidebarInner}
              >
                <FormStepper
                  application={storedApplication}
                  mode={mode}
                  showTag={showProgressTag}
                  form={form}
                  sections={sections}
                  screen={currentScreen}
                />
                {FormLogo && (
                  <Box
                    display={['none', 'none', 'flex']}
                    alignItems="center"
                    justifyContent="center"
                    marginRight={[0, 0, 0, 4]}
                    paddingBottom={4}
                  >
                    <FormLogo />
                  </Box>
                )}
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </Box>
  )
}
