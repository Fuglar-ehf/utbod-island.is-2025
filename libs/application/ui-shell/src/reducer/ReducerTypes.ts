import { Application, Form, Schema, Section } from '@island.is/application/core'
import { FormScreen } from '../types'

export interface ApplicationUIState {
  application: Application
  activeScreen: number
  dataSchema: Schema
  form: Form
  nationalRegistryId: string
  screens: FormScreen[]
  sections: Section[]
}

export enum ActionTypes {
  ANSWER = 'ANSWER',
  EXPAND_REPEATER = 'EXPAND_REPEATER',
  ANSWER_AND_GO_NEXT_SCREEN = 'ANSWER_AND_GO_NEXT_SCREEN',
  PREV_SCREEN = 'PREV_SCREEN',
  ADD_EXTERNAL_DATA = 'ADD_EXTERNAL_DATA',
  GO_TO_SCREEN = 'GO_TO_SCREEN',
}

export interface Action {
  type: ActionTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}
