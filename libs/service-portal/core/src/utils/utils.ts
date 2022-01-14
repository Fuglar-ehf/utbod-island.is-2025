import { User } from 'oidc-client'

export const userHasAccessToScope = (user: User, scope: string) => {
  return true
}

export const getNameAbbreviation = (name: string) => {
  const names = name.split(' ')
  let initials = names[0].substring(0, 1).toUpperCase()

  if (names.length > 1)
    initials += names[names.length - 1].substring(0, 1).toUpperCase()

  return initials
}

export const formatNationalId = (nationalId: string): string => {
  if (nationalId?.length === 10) {
    return `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`
  } else {
    return nationalId
  }
}

export const tableStyles = {
  paddingTop: '16px',
  paddingBottom: '16px',
}
