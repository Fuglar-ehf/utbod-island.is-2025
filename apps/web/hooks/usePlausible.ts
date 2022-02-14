import isEqual from 'lodash/isEqual'
import { useEffect, useState } from 'react'

export const usePlausible = (eventName: string, params: unknown) => {
  const [currentParams, setCurrentParams] = useState<unknown>()

  useEffect(() => {
    const maybeWindow = process.browser ? window : undefined

    if (!maybeWindow || !maybeWindow?.plausible) return null

    if (!isEqual(currentParams, params)) {
      setCurrentParams(params)
      maybeWindow.plausible(eventName, { props: params })
    }
  }, [currentParams, eventName, params])
}
