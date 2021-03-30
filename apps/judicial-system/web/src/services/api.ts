import 'isomorphic-fetch'

import { deleteCookie } from '@island.is/judicial-system-web/src/utils/cookies'
import { PresignedPost } from '@island.is/judicial-system/types'
import { UploadFile } from '@island.is/island-ui/core'

const { API_URL = '' } = process.env
export const apiUrl = API_URL

export const logOut = (path = '') => {
  if (window.location.pathname !== '/') {
    // We don't need to wait for the call
    fetch('/api/auth/logout')

    deleteCookie('judicial-system.csrf')

    window.location.assign(`/${path}`)
  }
}

export const getFeature = async (name: string): Promise<boolean> => {
  return await (await fetch(`/api/feature/${name}`)).json()
}
