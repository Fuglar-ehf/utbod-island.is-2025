import React, { FC, Children, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import cx from 'classnames'
import { theme } from '@island.is/island-ui/theme'
import { Box, BoxProps, GridContainer } from '@island.is/island-ui/core'

import * as styles from './GridItems.css'

type GridItemsProps = {
  marginTop?: BoxProps['marginTop']
  marginBottom?: BoxProps['marginBottom']
  paddingTop?: BoxProps['paddingTop']
  paddingBottom?: BoxProps['paddingBottom']
  insideGridContainer?: boolean
  mobileItemWidth?: number
  mobileItemsRows?: number
  half?: boolean
}

export const GridItems: FC<GridItemsProps> = ({
  marginTop = 0,
  marginBottom = 0,
  paddingTop = 0,
  paddingBottom = 0,
  insideGridContainer = false,
  mobileItemWidth = 400,
  mobileItemsRows = 3,
  half = false,
  children,
}) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  const items = Children.toArray(children)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.sm)
  }, [width])

  let style = null

  const count = items.length
  const perRow = Math.ceil(count / mobileItemsRows)

  if (isMobile) {
    style = {
      width: mobileItemWidth * perRow,
      gridTemplateColumns: `repeat(${perRow}, minmax(${mobileItemWidth}px, 1fr))`,
      minHeight: 0,
      minWidth: 0,
    }
  }

  return (
    <Wrapper show={insideGridContainer}>
      <Box
        marginTop={marginTop}
        marginBottom={marginBottom}
        className={styles.container}
      >
        <Box
          paddingTop={paddingTop}
          paddingBottom={paddingBottom}
          className={cx(styles.wrapper, { [styles.half]: half })}
          {...(style && { style })}
        >
          {children}
        </Box>
      </Box>
    </Wrapper>
  )
}

type WrapperProps = {
  show: boolean
  children: JSX.Element
}

const Wrapper: FC<WrapperProps> = ({ show = false, children }) =>
  show ? (
    <GridContainer className={styles.gridContainer}>{children}</GridContainer>
  ) : (
    children
  )

export default GridItems
