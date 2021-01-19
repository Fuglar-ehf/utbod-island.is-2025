import React, { FC, memo, ReactNode } from 'react'
import dynamic from 'next/dynamic'
import {
  renderSlices,
  defaultRenderComponent,
  RenderConfig,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'
import { LinkContext, Link } from '@island.is/island-ui/core'

const TellUsAStory = dynamic(() => import('../TellUsAStory/TellUsAStory'))
const ContactUs = dynamic(() => import('../ContactUs/ContactUs'))

const renderComponent = (
  slice: SliceType,
  locale: string,
  config: RenderConfig,
) => {
  let children: ReactNode | null = null

  switch (slice.__typename) {
    case 'ContactUs':
      children = <ContactUs {...slice} />
      break
    case 'TellUsAStory':
      children = <TellUsAStory {...slice} showIntro={false} locale={locale} />
      break
    default:
      children = defaultRenderComponent(slice, locale, config)
      break
  }

  children = <div id={slice.id}>{children}</div>

  return children
}

export const RichText: FC<{
  body: SliceType[]
  locale?: string
  config?: Partial<RenderConfig>
}> = memo(({ body, locale, config = {} }) => {
  return (
    <LinkContext.Provider
      value={{
        linkRenderer: (href, children) => (
          <Link
            href={href}
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            {children}
          </Link>
        ),
      }}
    >
      {renderSlices(body, locale, { renderComponent, ...config })}
    </LinkContext.Provider>
  )
})

export default RichText
