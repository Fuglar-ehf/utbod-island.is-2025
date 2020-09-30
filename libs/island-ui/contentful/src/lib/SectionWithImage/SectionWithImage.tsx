import React, { FC } from 'react'
import { Typography, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import slugify from '@sindresorhus/slugify'
import StaticHtml from '../StaticHtml/StaticHtml'
import { renderHtml } from '../richTextRendering'
import * as styles from './SectionWithImage.treat'

export interface SectionWithImageProps {
  title: string
  image?: {
    url: string
  }
  html?: { document: any }
}

export const SectionWithImage: FC<SectionWithImageProps> = ({
  title,
  image,
  html,
}) => {
  if (!image) {
    return (
      <>
        {title && (
          <Typography
            id={slugify(title)}
            variant="h2"
            as="h2"
            paddingTop={2}
            paddingBottom={2}
          >
            {title}
          </Typography>
        )}
        <StaticHtml>{renderHtml(html.document)}</StaticHtml>
      </>
    )
  }

  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '12/12', '3/9']}>
        <Box marginBottom={3} className={styles.imageContainer}>
          <img className={styles.image} src={image.url + '?w=600'} alt="" />
        </Box>
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '12/12', '6/9']}>
        {title && (
          <Typography
            id={slugify(title)}
            variant="h2"
            as="h2"
            paddingBottom={3}
          >
            {title}
          </Typography>
        )}
        <StaticHtml>{renderHtml(html.document)}</StaticHtml>
      </GridColumn>
    </GridRow>
  )
}
