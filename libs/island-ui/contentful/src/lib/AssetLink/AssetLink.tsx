import React, { FC } from 'react'
import { FocusableBox, LinkCard } from '@island.is/island-ui/core'

export interface AssetLinkProps {
  title: string
  url: string
}

export const AssetLink: FC<AssetLinkProps> = ({ title, url, children }) => {
  const parts = url.split('.')
  const extension = parts[parts.length - 1].toUpperCase()

  return (
    <FocusableBox href={url} border="standard" borderRadius="large">
      <LinkCard background="white" tag={extension}>
        {title || children}
      </LinkCard>
    </FocusableBox>
  )
}

export default AssetLink
