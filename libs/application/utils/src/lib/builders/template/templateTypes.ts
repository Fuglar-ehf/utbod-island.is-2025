import {
  AllowedDelegation,
  ApplicationStateMachineStatus,
  ApplicationTypes,
  DefaultEvents,
  Form,
  HistoryEventMessage,
  InstitutionTypes,
  PendingAction,
  StateLifeCycle,
  StaticText,
  TemplateApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'

import {
  AnyEventObject,
  EventObject,
  StateNodeConfig,
  MachineConfig,
  MachineOptions,
  StatesConfig,
} from 'xstate'

export interface ApplicationBlueprint {
  applicationType: ApplicationTypes
  institution: InstitutionTypes
  initalState: string
  name: StaticText
  states: StateBlueprint[]
  translationNamespaces?: string[]
  allowedDelegations?: AllowedDelegation[]
  featureFlag?: Features
  requiredScopes?: string[]
}

export interface Transition {
  target: string
  event: string
}

export interface StateBlueprint {
  name: string
  form?: Form
  transitions: Transition[]
  status: ApplicationStateMachineStatus
  lifecycle: StateLifeCycle
  pendingAction?: PendingAction
  historyLogs?: HistoryEventMessage[] | HistoryEventMessage
  onEntry?: TemplateApi[] | TemplateApi
  onExit?: TemplateApi[] | TemplateApi
  dataProviders?: TemplateApi[]
}

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.EDIT }
  | { type: DefaultEvents.REJECT }

export enum States {
  DRAFT = 'draft',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
  PREREQUISITES = 'prerequisites',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export type TransitionConfigOrTarget<TContext, TEvent extends EventObject> = {
  target: string
}

export type TransitionsConfig<TContext, TEvents extends EventObject> = {
  [K in TEvents['type']]?: TransitionConfigOrTarget<
    TContext,
    TEvents extends { type: K } ? TEvents : never
  >
} & {
  [key: string]: TransitionConfigOrTarget<TContext, TEvents>
}
