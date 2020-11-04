import React, { FC } from 'react'
import Head from 'next/head'

interface HeadWithSocialSharingProps {
  title: string
  description?: string
  imageUrl?: string
  imageWidth?: string
  imageHeight?: string
}

export const HeadWithSocialSharing: FC<HeadWithSocialSharingProps> = ({
  title,
  description = 'Ísland.is er upplýsinga- og þjónustuveita opinberra aðila á Íslandi. Þar getur fólk og fyrirtæki fengið upplýsingar og notið margvíslegrar þjónustu hjá opinberum aðilum á einum stað í gegnum eina gátt.',
  imageUrl = 'island.is/island-fb-1200x630.png',
  imageWidth = '1200',
  imageHeight = '630',
  children,
}) => (
  <Head>
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={'https:' + imageUrl} />
    <meta property="og:image:width" content={imageWidth} />
    <meta property="og:image:height" content={imageHeight} />

    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://island.is/" />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={'https:' + imageUrl} />
    {children}
  </Head>
)

export default HeadWithSocialSharing
