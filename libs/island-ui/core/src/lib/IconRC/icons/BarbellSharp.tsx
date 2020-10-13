import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgBarbellSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="barbell-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M496 176h-58v-64h-76v122H150V112H74v64H16v160h58v64h76V278h212v122h76v-64h58V176z" />
    </svg>
  )
}

export default SvgBarbellSharp
