import React, { Fragment, ReactNode } from 'react'
import { Document } from '@contentful/rich-text-types'
import {
  documentToReactComponents,
  Options,
} from '@contentful/rich-text-react-renderer'
import { ImageProps } from '../Image/Image'
import { FaqListProps } from '../FaqList/FaqList'
import { StatisticsProps } from '../Statistics/Statistics'
import { AssetLinkProps } from '../AssetLink/AssetLink'
import { ProcessEntryProps } from '../ProcessEntry/ProcessEntry'
import { EmbeddedVideoProps } from '../EmbeddedVideo/EmbeddedVideo'
import { SectionWithImageProps } from '../SectionWithImage/SectionWithImage'
import { TeamListProps } from '../TeamList/TeamList'
import { ContactUsProps } from '../ContactUs/ContactUs'
import { LocationProps } from '../Location/Location'
import { TellUsAStoryFormProps } from '../TellUsAStoryForm/TellUsAStoryForm'
import { defaultRenderNode } from './defaultRenderNode'
import { defaultRenderMark } from './defaultRenderMark'
import { defaultRenderComponent } from './defaultRenderComponents'
import { Box } from '@island.is/island-ui/core'

type HtmlSlice = { __typename: 'Html'; id: string; document: Document }
type FaqListSlice = { __typename: 'FaqList'; id: string } & FaqListProps
type ConnectedComponentSlice = {
  __typename: 'ConnectedComponent'
  id: string
  title: string
  json: string
  componentType: string
}
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
type TellUsAStorySlice = { __typename: 'TellUsAStory'; id: string } & Omit<
  TellUsAStoryFormProps,
  'state' | 'onSubmit'
>
type SectionWithImageSlice = {
  __typename: 'SectionWithImage'
  id: string
} & SectionWithImageProps

export type SliceType =
  | HtmlSlice
  | FaqListSlice
  | ConnectedComponentSlice
  | StatisticsSlice
  | ImageSlice
  | AssetSlice
  | ProcessEntrySlice
  | EmbeddedVideoSlice
  | TeamListSlice
  | ContactUsSlice
  | LocationSlice
  | TellUsAStorySlice
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

type RichText = (
  richTextDocument: SliceType[],
  options?:
    | {
        renderNode: Options['renderNode']
        renderMark: Options['renderMark']
        renderComponent: {
          [slice in keyof typeof defaultRenderComponent]: (
            SliceType,
          ) => ReactNode
        }
      }
    | { renderNode?: {}; renderMark?: {}; renderComponent?: {} },
) => React.ReactNode

export const richText: RichText = (
  documents,
  opt = { renderNode: {}, renderMark: {}, renderComponent: {} },
) => {
  const options = {
    renderNode: { ...defaultRenderNode, ...opt.renderNode },
    renderMark: { ...defaultRenderMark, ...opt.renderMark },
  }
  const renderComponent = { ...defaultRenderComponent, ...opt.renderComponent }
  return documents.map((slice) => {
    if (slice.__typename === 'Html') {
      return (
        <Fragment key={slice.id}>
          {documentToReactComponents(slice.document, options)}
        </Fragment>
      )
    }
    return (
      <Box
        key={slice.id}
        id={slice.id}
        marginBottom={[5, 5, 5, 6]}
        marginTop={[5, 5, 5, 6]}
      >
        {renderComponent[slice.__typename]?.(slice)}
      </Box>
    )
  })
}
