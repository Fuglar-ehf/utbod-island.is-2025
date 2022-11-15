import { PowerBIEmbed } from 'powerbi-client-react'
import { Embed } from 'powerbi-client'
import { PowerBiSlice as PowerBiSliceSchema } from '@island.is/web/graphql/schema'

interface PowerBiSliceProps {
  slice: PowerBiSliceSchema
}

export const PowerBiSlice = ({ slice }: PowerBiSliceProps) => {
  const getEmbeddedComponent = (embed: Embed) => {
    // Default styles
    embed.element.style.height = '600px'
    embed.iframe.style.border = 'none'

    // Apply styles to containing element from CMS
    const elementStyle = slice?.powerBiEmbedProps?.style?.element
    if (elementStyle) {
      for (const key of Object.keys(elementStyle)) {
        const value = elementStyle?.[key]
        if (value) {
          embed.element.style[key] = value
        }
      }
    }

    // Apply styles to iframe child emelement from CMS
    const iframeStyle = slice?.powerBiEmbedProps?.style?.iframe
    if (iframeStyle) {
      for (const key of Object.keys(iframeStyle)) {
        const value = iframeStyle?.[key]
        if (value) {
          embed.element.style[key] = value
        }
      }
    }
  }

  const embedProps = slice?.powerBiEmbedProps?.embedProps ?? {}
  return (
    <PowerBIEmbed
      embedConfig={{ type: 'report', ...embedProps }}
      getEmbeddedComponent={getEmbeddedComponent}
    />
  )
}

export default PowerBiSlice
