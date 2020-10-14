import React, { FC } from 'react'
import * as styles from './Table.treat'
import cn from 'classnames'
import { Text } from '@island.is/island-ui/core'

interface Data {
  span?: number
  alignRight?: boolean
  textVariant?: any
}

export const Table: FC = ({ children }) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>{children}</table>
    </div>
  )
}
export const Head: FC = ({ children }) => {
  return <thead className={styles.tHead}>{children}</thead>
}
export const Body: FC = ({ children }) => {
  return <tbody>{children}</tbody>
}
export const Row: FC = ({ children }) => {
  return <tr className={styles.tr}>{children}</tr>
}
export const Data: FC<Data> = ({
  children,
  span = 1,
  alignRight,
  textVariant = 'default',
}) => {
  return (
    <td
      className={cn(styles.td, { [styles.alignRight]: alignRight })}
      colSpan={span}
    >
      <Text variant={textVariant}>{children}</Text>
    </td>
  )
}

export const HeadData: FC<Data> = ({
  children,
  span,
  alignRight,
  textVariant = 'default',
}) => {
  return (
    <td
      className={cn(styles.tdHead, { [styles.alignRight]: alignRight })}
      colSpan={span}
    >
      <div className={cn(styles.block)}>
        <Text variant={textVariant}>{children}</Text>
      </div>
    </td>
  )
}
