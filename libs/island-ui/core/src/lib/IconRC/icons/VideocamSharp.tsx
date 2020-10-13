import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgVideocamSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="videocam-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M336 208v-80a16 16 0 00-16-16H32a16 16 0 00-16 16v256a16 16 0 0016 16h288a16 16 0 0016-16v-80l160 96V112z" />
    </svg>
  )
}

export default SvgVideocamSharp
