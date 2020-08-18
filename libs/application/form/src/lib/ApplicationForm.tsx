import React, { FC, useReducer } from 'react'
import { ApolloProvider } from '@apollo/client'

import { FormValue, Form } from '@island.is/application/schema'
import FormProgress from '../components/FormProgress/'
import ApplicationName from '../components/ApplicationName/'
import Sidebar from '../components/Sidebar'
import Screen from '../components/Screen'
import {
  ApplicationReducer,
  initializeReducer,
} from '../reducer/ApplicationFormReducer'
import { ActionTypes } from '../reducer/ReducerTypes'
import { Box } from '@island.is/island-ui/core'
import { client } from '../graphql/client'
import * as styles from './ApplicationForm.treat'
import ProgressIndicator from '../components/ProgressIndicator'

type ApplicationProps = {
  form: Form
  initialAnswers: FormValue
}

const ApplicationFormBody: FC<ApplicationProps> = ({
  form,
  initialAnswers,
}) => {
  const [state, dispatch] = useReducer(
    ApplicationReducer,
    {
      form,
      formLeaves: [],
      formValue: initialAnswers,
      activeSection: 0,
      activeSubSection: 0,
      activeScreen: 0,
      progress: 0,
      screens: [],
      sections: [],
    },
    initializeReducer,
  )
  const {
    activeSection,
    activeSubSection,
    activeScreen,
    formValue,
    progress,
    sections,
    screens,
  } = state

  return (
    <Box display="flex" flexGrow={1}>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="row"
        className={styles.applicationContainer}
      >
        <Box className={styles.sidebarContainer}>
          <Sidebar>
            <ApplicationName name={form.name} icon={form.icon} />
            <Box display="flex" flexDirection={['column', 'columnReverse']}>
              <FormProgress
                sections={sections}
                activeSection={activeSection}
                activeSubSection={activeSubSection}
              />
              <ProgressIndicator progress={progress} />
            </Box>
          </Sidebar>
        </Box>

        <Box
          paddingX={[3, 3, 12]}
          paddingTop={4}
          height="full"
          className={styles.screenContainer}
        >
          <Screen
            answerQuestions={(payload) =>
              dispatch({ type: ActionTypes.ANSWER, payload })
            }
            dataSchema={form.schema}
            formTypeId={form.id}
            formValue={formValue}
            expandRepeater={() =>
              dispatch({ type: ActionTypes.EXPAND_REPEATER })
            }
            nextScreen={() => dispatch({ type: ActionTypes.NEXT_SCREEN })}
            prevScreen={() => dispatch({ type: ActionTypes.PREV_SCREEN })}
            shouldSubmit={activeScreen === screens.length - 1}
            screen={screens[activeScreen]}
            section={sections[activeSection]}
          />
        </Box>
      </Box>
    </Box>
  )
}

export const ApplicationForm = (props: ApplicationProps) => (
  <ApolloProvider client={client}>
    <ApplicationFormBody {...props} />
  </ApolloProvider>
)
