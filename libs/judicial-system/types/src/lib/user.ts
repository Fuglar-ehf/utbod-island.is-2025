import type { Institution } from './institution'

export enum UserRole {
  PROSECUTOR = 'PROSECUTOR',
  REPRESENTATIVE = 'REPRESENTATIVE',
  REGISTRAR = 'REGISTRAR',
  JUDGE = 'JUDGE',
  ADMIN = 'ADMIN', // Does not exist in the database
  STAFF = 'STAFF',
  DEFENDER = 'DEFENDER', // Does not exist in the database
}

export interface User {
  id: string
  created: string
  modified: string
  nationalId: string
  name: string
  title: string
  mobileNumber: string
  email: string
  role: UserRole
  institution?: Institution
  active: boolean
}

export interface CreateUser {
  nationalId: string
  name: string
  title: string
  mobileNumber: string
  email: string
  role: UserRole
  institutionId: string
  active: boolean
}

export interface UpdateUser {
  name?: string
  title?: string
  mobileNumber?: string
  email?: string
  role?: UserRole
  institutionId?: string
  active?: boolean
}

export const prosecutionRoles = [UserRole.PROSECUTOR, UserRole.REPRESENTATIVE]

export function isProsecutionRole(role: UserRole): boolean {
  return prosecutionRoles.includes(role)
}

export const courtRoles = [UserRole.JUDGE, UserRole.REGISTRAR]

export function isCourtRole(role: UserRole): boolean {
  return courtRoles.includes(role)
}
