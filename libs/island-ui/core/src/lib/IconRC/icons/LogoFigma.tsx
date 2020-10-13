import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgLogoFigma = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="logo-figma_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M336 176a80 80 0 000-160H176a80 80 0 000 160 80 80 0 000 160 80 80 0 1080 80V176z" />
      <circle cx={336} cy={256} r={80} />
    </svg>
  )
}

export default SvgLogoFigma
