import React from 'react'
import { useIntl } from 'react-intl'
import {
  DescriptionText,
  ErrorModal,
} from '@island.is/application/templates/family-matters-core/components'
import { noChildren } from '../../lib/messages'

const NoChildrenErrorModal = () => {
  const { formatMessage } = useIntl()
  return (
    <ErrorModal
      title={formatMessage(noChildren.title)}
      link={{
        text: formatMessage(noChildren.linkText),
        href: formatMessage(noChildren.linkHref),
      }}
    >
      <DescriptionText text={noChildren.description} />
    </ErrorModal>
  )
}

export default NoChildrenErrorModal
