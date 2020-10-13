import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCodeWorking = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="code-working_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle
        cx={256}
        cy={256}
        r={26}
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={10}
      />
      <circle
        cx={346}
        cy={256}
        r={26}
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={10}
      />
      <circle
        cx={166}
        cy={256}
        r={26}
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={10}
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={42}
        d="M160 368L32 256l128-112m192 224l128-112-128-112"
      />
    </svg>
  )
}

export default SvgCodeWorking
