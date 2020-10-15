import React, { ReactNode, Fragment } from 'react'
import {
  Document,
  Block,
  Inline,
  BLOCKS,
  INLINES,
} from '@contentful/rich-text-types'
import { Asset } from 'contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Image, ImageProps } from './Image/Image'
import FaqList, { FaqListProps } from './FaqList/FaqList'
import { Statistics, StatisticsProps } from './Statistics/Statistics'
import Hyperlink from './Hyperlink/Hyperlink'
import { AssetLink, AssetLinkProps } from './AssetLink/AssetLink'
import {
  Text,
  TextProps,
  Blockquote,
  Box,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { ProcessEntry, ProcessEntryProps } from './ProcessEntry/ProcessEntry'
import EmbeddedVideo, {
  EmbeddedVideoProps,
} from './EmbeddedVideo/EmbeddedVideo'
import StaticHtml from './StaticHtml/StaticHtml'
import slugify from '@sindresorhus/slugify'
import {
  SectionWithImage,
  SectionWithImageProps,
} from './SectionWithImage/SectionWithImage'
import { TeamList, TeamListProps } from './TeamList/TeamList'
import { ContactUs, ContactUsProps } from './ContactUs/ContactUs'
import { Location, LocationProps } from './Location/Location'

type HtmlSlice = { __typename: 'Html'; id: string; document: Document }
type FaqListSlice = { __typename: 'FaqList'; id: string } & FaqListProps
type StatisticsSlice = {
  __typename: 'Statistics'
  id: string
} & StatisticsProps
type ImageSlice = { __typename: 'Image'; id: string } & Omit<
  ImageProps,
  'thumbnail'
>
type AssetSlice = { __typename: 'Asset'; id: string } & AssetLinkProps
type ProcessEntrySlice = {
  __typename: 'ProcessEntry'
  id: string
} & ProcessEntryProps
type EmbeddedVideoSlice = {
  __typename: 'EmbeddedVideo'
  id: string
} & EmbeddedVideoProps
type TeamListSlice = { __typename: 'TeamList'; id: string } & TeamListProps
type LocationSlice = { __typename: 'Location'; id: string } & LocationProps
type ContactUsSlice = { __typename: 'ContactUs'; id: string } & Omit<
  ContactUsProps,
  'state' | 'onSubmit'
>
type SectionWithImageSlice = {
  __typename: 'SectionWithImage'
  id: string
} & SectionWithImageProps

export type Slice =
  | HtmlSlice
  | FaqListSlice
  | StatisticsSlice
  | ImageSlice
  | AssetSlice
  | ProcessEntrySlice
  | EmbeddedVideoSlice
  | TeamListSlice
  | ContactUsSlice
  | LocationSlice
  | SectionWithImageSlice
  | {
      // TODO: these are used on the about page - we need to move their rendering
      // to here to make them re-usable by other page types
      __typename:
        | 'TimelineSlice'
        | 'HeadingSlice'
        | 'LinkCardSlice'
        | 'MailingListSignupSlice'
        | 'StorySlice'
        | 'LatestNewsSlice'
        | 'LogoListSlice'
        | 'BulletListSlice'
        | 'TabSection'
      id: string
    }

type SliceType = Slice['__typename']

export interface RenderNode {
  [k: string]: (node: Block | Inline, children: ReactNode) => ReactNode
}

export interface PaddingConfig {
  sorted?: boolean
  space: ResponsiveSpace
  types: [SliceType, SliceType]
}

export interface RenderConfig {
  renderComponent: (slice: Slice, config: RenderConfig) => ReactNode
  renderPadding: (top: Slice, bottom: Slice, config: RenderConfig) => ReactNode
  renderNode: RenderNode
  htmlClassName?: string
  defaultPadding: ResponsiveSpace
  padding: Readonly<Array<PaddingConfig>>
}

export const defaultRenderComponent = (
  slice: Slice,
  { renderNode, htmlClassName }: RenderConfig,
): ReactNode => {
  switch (slice.__typename) {
    case 'Html':
      return renderHtml(slice.document, {
        className: htmlClassName,
        renderNode,
      })

    case 'FaqList':
      return <FaqList {...slice} />

    case 'Statistics':
      return <Statistics {...slice} />

    case 'Image':
      return <Image {...slice} thumbnail={slice.url + '?w=50'} />

    case 'Asset':
      return <AssetLink {...slice} />

    case 'ProcessEntry':
      return <ProcessEntry {...slice} />

    case 'EmbeddedVideo':
      return <EmbeddedVideo {...slice} />

    case 'SectionWithImage':
      return <SectionWithImage {...slice} />

    case 'TeamList':
      return <TeamList {...slice} />

    case 'Location':
      return <Location {...slice} />

    case 'ContactUs':
      // NB: ContactUs needs to be connected with submit logic higher up
      return (
        <ContactUs
          {...slice}
          onSubmit={async (data) => console.warn(data)}
          state="edit"
        />
      )

    default:
      // TODO: this should be an exhaustive list of slice types, but some slice
      // types are only used on certain types of pages that are not using this
      // renderer at the moment (e.g. the AboutPage)
      return null
  }
}

const typography = (
  variant: TextProps['variant'],
  as: TextProps['as'],
  withId = false,
) => (_: Block | Inline, children: ReactNode) => (
  <Text
    id={withId ? slugify(String(children)) : undefined}
    variant={variant}
    as={as}
  >
    {children}
  </Text>
)

export const defaultRenderNode: Readonly<RenderNode> = {
  [BLOCKS.HEADING_1]: typography('h1', 'h1', true),
  [BLOCKS.HEADING_2]: typography('h2', 'h2', true),
  [BLOCKS.HEADING_3]: typography('h3', 'h3', true),
  [BLOCKS.HEADING_4]: typography('h4', 'h4', true),
  [BLOCKS.HEADING_5]: typography('h5', 'h5'),
  [BLOCKS.PARAGRAPH]: typography('default', 'p'),
  [BLOCKS.QUOTE]: (node: Block | Inline, children: ReactNode): ReactNode => (
    <Blockquote>{children}</Blockquote>
  ),
  [INLINES.HYPERLINK]: (
    node: Block | Inline,
    children: ReactNode,
  ): ReactNode => <Hyperlink href={node.data.uri}>{children}</Hyperlink>,
  [INLINES.ASSET_HYPERLINK]: (
    node: Block | Inline,
    children: ReactNode,
  ): ReactNode => {
    const asset = (node.data.target as unknown) as Asset
    return asset.fields.file?.url ? (
      <Hyperlink href={asset.fields.file.url}>{children}</Hyperlink>
    ) : null
  },
}

export const renderHtml = (
  document: Document,
  {
    renderNode = defaultRenderNode,
    className,
  }: {
    renderNode?: RenderNode
    className?: string
  } = {},
): ReactNode => {
  return (
    <StaticHtml className={className}>
      {documentToReactComponents(document, { renderNode })}
    </StaticHtml>
  )
}

export const defaultRenderPadding = (
  { __typename: above }: Slice,
  { __typename: below }: Slice,
  config: RenderConfig,
): ReactNode => {
  for (const {
    sorted = false,
    space,
    types: [a, b],
  } of config.padding) {
    if (
      (a === above && b === below) ||
      (!sorted && a === below && b === above)
    ) {
      return <Box paddingTop={space} />
    }
  }

  return <Box paddingTop={config.defaultPadding} />
}

export const DefaultRenderConfig: RenderConfig = {
  renderComponent: defaultRenderComponent,
  renderPadding: defaultRenderPadding,
  renderNode: defaultRenderNode,
  defaultPadding: 10,
  padding: [] as const,
} as const

export const renderSlices = (
  slices: Slice | Slice[],
  optionalConfig?: Partial<RenderConfig>,
): ReactNode => {
  const config: RenderConfig = {
    ...DefaultRenderConfig,
    ...optionalConfig,
  }

  if (!slices) {
    return null
  }

  if (!Array.isArray(slices)) {
    slices = [slices]
  }

  const components = slices.map((slice, index) => {
    const comp = config.renderComponent(slice, config)
    if (!comp) {
      return null
    }

    const allSlices = slices as { [key: number]: Slice }

    return (
      <Fragment key={index}>
        {index > 0 && config.renderPadding(allSlices[index - 1], slice, config)}
        {comp}
      </Fragment>
    )
  })

  return <>{components.filter(Boolean)}</>
}
