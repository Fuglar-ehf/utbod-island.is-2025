import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgChevronBackSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="chevron-back-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={48}
        d="M328 112L184 256l144 144"
      />
    </svg>
  )
}

export default SvgChevronBackSharp
