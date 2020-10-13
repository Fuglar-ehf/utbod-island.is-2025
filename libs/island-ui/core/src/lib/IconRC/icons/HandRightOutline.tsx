import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgHandRightOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="hand-right-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M432 320V144a32 32 0 00-32-32h0a32 32 0 00-32 32v112m0 0V80a32 32 0 00-32-32h0a32 32 0 00-32 32v160m-64 1V96a32 32 0 00-32-32h0a32 32 0 00-32 32v224m128-80V48a32 32 0 00-32-32h0a32 32 0 00-32 32v192"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        d="M432 320c0 117.4-64 176-152 176s-123.71-39.6-144-88L83.33 264c-6.66-18.05-3.64-34.79 11.87-43.6h0c15.52-8.82 35.91-4.28 44.31 11.68L176 320"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgHandRightOutline
