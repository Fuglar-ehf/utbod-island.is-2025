import { User } from 'oidc-client'
import {
  ServicePortalRoute,
  ServicePortalModule,
} from '@island.is/service-portal/core'
import { ModuleKeys } from './modules'

export type MenuState = 'open' | 'closed'
export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export enum ActionType {
  SetUserPending = 'setUserPending',
  SetUserLoggedOut = 'setUserLoggedOut',
  SetUserFulfilled = 'setUserFulfilled',
  SetUserLoggingOut = 'setUserLoggingOut',
  FetchSubjectListPending = 'fetchSubjectListPending',
  FetchSubjectListFulfilled = 'fetchSubjectListFulfilled',
  FetchSubjectListFailed = 'fetchSubjectListFailed',
  SetNotificationMenuState = 'setNotificationMenuState',
  SetMobileMenuState = 'setMobileMenuState',
  SetUserMenuState = 'setUserMenuState',
  SetRoutesFulfilled = 'setRoutesFulfilled',
  SetModulesList = 'setModulesList',
}

export type Action =
  | { type: ActionType.SetUserPending }
  | { type: ActionType.SetUserLoggedOut }
  | { type: ActionType.SetUserFulfilled; payload: User }
  | { type: ActionType.FetchSubjectListPending }
  | { type: ActionType.FetchSubjectListFailed }
  | {
      type: ActionType.SetNotificationMenuState
      payload: MenuState
    }
  | {
      type: ActionType.SetMobileMenuState
      payload: MenuState
    }
  | {
      type: ActionType.SetUserMenuState
      payload: MenuState
    }
  | {
      type: ActionType.SetRoutesFulfilled
      payload: ServicePortalRoute[]
    }
  | {
      type: ActionType.SetUserLoggingOut
    }
  | {
      type: ActionType.SetModulesList
      payload: Record<ModuleKeys, ServicePortalModule>
    }
