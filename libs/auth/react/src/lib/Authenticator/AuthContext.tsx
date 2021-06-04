import { createContext, useContext } from 'react'

import { AuthReducerState, initialState } from './Authenticator.state'

export interface AuthContextType extends AuthReducerState {
  signIn: () => void
  signInSilent: () => void
  switchUser: (nationalId?: string) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn() {
    // Intentionally empty
  },
  signInSilent() {
    // Intentionally empty
  },
  switchUser(nationalId?: string) {
    // Intentionally empty
  },
  signOut() {
    // Intentionally empty
  },
})

export const useAuth: () => AuthContextType = () => useContext(AuthContext)
