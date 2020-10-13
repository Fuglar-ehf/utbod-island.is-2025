import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgLocate = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="locate_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={48}
        d="M256 96V56m0 400v-40m0-304a144 144 0 10144 144 144 144 0 00-144-144zm160 144h40m-400 0h40"
      />
    </svg>
  )
}

export default SvgLocate
