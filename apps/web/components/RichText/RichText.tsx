import React, { FC, memo, ReactNode } from 'react'
import { AllSlicesFragment as Slice } from '@island.is/web/graphql/schema'
import {
  renderSlices,
  defaultRenderComponent,
  RenderConfig,
} from '@island.is/island-ui/contentful'
import { GridRow, GridColumn } from '@island.is/island-ui/core'
import ContactUs from '../ContactUs/ContactUs'

const FULL_WIDTH_SLICE_TYPES: Array<Slice['__typename']> = [
  'ProcessEntry',
  'SectionWithImage',
  'TeamList',
  'ContactUs',
  'Location',
]

const renderComponent = (slice: Slice, config: RenderConfig) => {
  let children: ReactNode =
    slice.__typename === 'ContactUs' ? (
      <ContactUs {...slice} />
    ) : (
      defaultRenderComponent(slice, config)
    )

  if (!FULL_WIDTH_SLICE_TYPES.includes(slice.__typename)) {
    // XXX: We assume the component is rendered in a 9 column layout on desktop.
    // If that turns out not to always be the case we need to make this configurable
    children = (
      <GridRow>
        <GridColumn
          offset={['0', '0', '0', '0', '1/9']}
          span={['9/9', '9/9', '9/9', '9/9', '7/9']}
        >
          {children}
        </GridColumn>
      </GridRow>
    )
  }

  if (slice.__typename !== 'Html') {
    // Wrap with slice id for navigation and linking to specific slice.
    // Html type is excluded because navigation/linking is handled by
    // the heading tags in the html.
    children = <div id={slice.id}>{children}</div>
  }

  return children
}

export const RichText: FC<{
  body: Slice[]
  config?: Partial<RenderConfig>
}> = memo(({ body, config = {} }) => {
  return <>{renderSlices(body, { renderComponent, ...config })}</>
})

export default RichText
