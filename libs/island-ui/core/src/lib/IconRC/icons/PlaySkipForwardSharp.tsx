import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgPlaySkipForwardSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="play-skip-forward-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M368.53 64v163.52L96 64v384l272.53-163.52V448H416V64h-47.47z" />
    </svg>
  )
}

export default SvgPlaySkipForwardSharp
