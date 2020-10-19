import { useContext } from 'react'
import { LocaleContext } from './LocaleContext'
import { MessageDescriptor, useIntl } from 'react-intl'

export function useLocale() {
  const intl = useIntl()
  const contextValue = useContext(LocaleContext)
  const lang = contextValue === null ? null : contextValue.lang
  function formatMessage(
    descriptor: MessageDescriptor | string,
    values?: any,
  ): string {
    if (!descriptor || typeof descriptor === 'string')
      return descriptor as string

    return intl.formatMessage(descriptor, values)
  }

  return {
    ...intl,
    formatMessage,
    lang,
  }
}

export default useLocale
