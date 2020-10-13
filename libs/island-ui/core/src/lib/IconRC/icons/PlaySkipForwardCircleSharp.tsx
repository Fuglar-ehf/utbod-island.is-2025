import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgPlaySkipForwardCircleSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="play-skip-forward-circle-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm80 288h-32v-69l-128 77.37V167.49L304 245v-69h32z" />
    </svg>
  )
}

export default SvgPlaySkipForwardCircleSharp
