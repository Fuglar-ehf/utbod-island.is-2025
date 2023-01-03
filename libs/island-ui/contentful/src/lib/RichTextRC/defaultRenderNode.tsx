import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { Asset } from 'contentful'
import { RenderNode } from '@contentful/rich-text-react-renderer'
import slugify from '@sindresorhus/slugify'
import {
  getTextStyles,
  Blockquote,
  ResponsiveSpace,
  Box,
  Table as T,
} from '@island.is/island-ui/core'
import Hyperlink from '../Hyperlink/Hyperlink'
import * as styles from './RichText.css'

const defaultHeaderMargins: {
  marginBottom: ResponsiveSpace
  marginTop: ResponsiveSpace
} = { marginBottom: 2, marginTop: [5, 5, 5, 6] }

const componentMargins: {
  marginBottom: ResponsiveSpace
  marginTop: ResponsiveSpace
} = { marginBottom: [5, 5, 5, 6], marginTop: [5, 5, 5, 6] }

// Searches render node children recursively for the text
const getInnerText = (node: any): string => {
  if (typeof node === 'string') {
    return node
  }

  // we check all entries of this array for a valid string value
  if (Array.isArray(node)) {
    // check all array entries and return the first non empty string
    for (const entry of node) {
      // if the array entry is a non empty string return it
      if (typeof entry === 'string' && entry.length) {
        return entry
      } else {
        // the entry is an array or an object, try and find an embedded string
        const foundValue = getInnerText(entry)
        if (foundValue.length) {
          return foundValue
        }
      }
    }
  }

  if (typeof node === 'object' && node) {
    const inner = node?.props?.children ?? null
    return getInnerText(inner)
  }

  return ''
}
export const defaultRenderNodeObject: RenderNode = {
  [BLOCKS.HEADING_1]: (_node, children) => (
    <Box
      id={slugify(getInnerText(children))}
      component="h1"
      className={getTextStyles({ variant: 'h1' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_2]: (_node, children) => (
    <Box
      id={slugify(getInnerText(children))}
      component="h2"
      className={getTextStyles({ variant: 'h2' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_3]: (_node, children) => (
    <Box
      id={slugify(getInnerText(children))}
      component="h3"
      className={getTextStyles({ variant: 'h3' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_4]: (_node, children) => (
    <Box
      id={slugify(getInnerText(children))}
      component="h4"
      className={getTextStyles({ variant: 'h4' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_5]: (_node, children) => (
    <Box
      component="h5"
      className={getTextStyles({ variant: 'h5' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_6]: (_node, children) => (
    <Box
      component="p"
      className={getTextStyles({ variant: 'intro' }) + ' ' + styles.heading}
      marginTop={4}
      marginBottom={2}
    >
      {children}
    </Box>
  ),
  [BLOCKS.PARAGRAPH]: (_node, children) => (
    <Box component="p" className={getTextStyles({}) + ' ' + styles.paragraph}>
      {children}
    </Box>
  ),
  [BLOCKS.OL_LIST]: (_node, children) => (
    // An extra box container was added due to counter not resetting
    <Box>
      <Box component="ol" className={styles.orderedList}>
        {children}
      </Box>
    </Box>
  ),
  [BLOCKS.UL_LIST]: (_node, children) => (
    <Box component="ul" className={styles.unorderedList}>
      {children}
    </Box>
  ),
  [BLOCKS.LIST_ITEM]: (_node, children) => (
    <Box component="li" className={styles.listItem}>
      {children}
    </Box>
  ),
  [BLOCKS.QUOTE]: (_node, children) => (
    <Box {...componentMargins}>
      <Blockquote>{children}</Blockquote>
    </Box>
  ),
  [BLOCKS.HR]: () => (
    <Box {...componentMargins}>
      <hr />
    </Box>
  ),
  [BLOCKS.TABLE]: (_node, children) => <T.Table>{children}</T.Table>,
  [BLOCKS.TABLE_ROW]: (_node, children) => {
    if (
      (children as { nodeType: string }[])?.every(
        (childNode) => childNode?.nodeType === BLOCKS.TABLE_HEADER_CELL,
      )
    ) {
      return <T.Head>{children}</T.Head>
    }
    return <T.Row>{children}</T.Row>
  },
  [BLOCKS.TABLE_HEADER_CELL]: (_node, children) => (
    <T.HeadData>{children}</T.HeadData>
  ),
  [BLOCKS.TABLE_CELL]: (_node, children) => <T.Data>{children}</T.Data>,
  [BLOCKS.EMBEDDED_ASSET]: (node) => {
    const url = node?.data?.target?.fields?.file?.url
    const title = node?.data?.target?.fields
    return (
      <Box marginTop={url ? 5 : 0}>
        <img src={url} alt={title} />
      </Box>
    )
  },
  [INLINES.HYPERLINK]: (node, children) => (
    <Hyperlink href={node.data.uri}>{children}</Hyperlink>
  ),
  [INLINES.ASSET_HYPERLINK]: (node, children) => {
    const asset = (node.data.target as unknown) as Asset
    // The url might not contain a protocol that's why we prepend https:
    // https://www.contentful.com/developers/docs/concepts/images/
    let url: string
    if (asset?.fields?.file?.url) {
      url = asset.fields.file.url.startsWith('//')
        ? `https:${asset.fields.file.url}`
        : asset.fields.file.url
    } else {
      url = ''
    }
    return url ? <Hyperlink href={url}>{children}</Hyperlink> : null
  },
  [INLINES.ENTRY_HYPERLINK]: (node, children) => {
    const entry = node.data.target
    const type = entry?.sys?.contentType?.sys?.id
    switch (type) {
      case 'article':
        return entry?.fields?.slug ? (
          <Hyperlink
            href={`/${
              entry.sys?.locale === 'is-IS' ? '' : entry.sys?.locale + '/'
            }${entry?.fields?.slug}`}
          >
            {children}
          </Hyperlink>
        ) : null
      case 'subArticle':
        return entry?.fields?.url ? (
          <Hyperlink href={entry.fields.url}>{children}</Hyperlink>
        ) : null
      case 'organizationPage': {
        const prefix = getOrganizationPrefix(entry?.sys?.locale)
        return entry.fields.slug ? (
          <Hyperlink href={`/${prefix}/${entry.fields.slug}`}>
            {children}
          </Hyperlink>
        ) : null
      }
      case 'organizationSubpage': {
        const prefix = getOrganizationPrefix(entry?.sys?.locale)
        return entry?.fields?.slug &&
          entry.fields.organizationPage?.fields?.slug ? (
          <Hyperlink
            href={`/${prefix}/${entry.fields.organizationPage.fields.slug}/${entry.fields.slug}`}
          >
            {children}
          </Hyperlink>
        ) : null
      }
      default:
        return null
    }
  },
}

const getOrganizationPrefix = (locale: string) => {
  if (locale && !locale.includes('is')) {
    return `${locale}/o`
  }
  return 's'
}
