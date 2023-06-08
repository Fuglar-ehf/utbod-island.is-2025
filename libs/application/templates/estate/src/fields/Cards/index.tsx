import { FC } from 'react'
import { Application, FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  ProfileCard,
  Text,
} from '@island.is/island-ui/core'
import { FormatMessage, useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

type Props = {
  field: {
    props: {
      cards: (
        application: Application,
      ) => {
        title?: string
        description?:
          | string
          | string[]
          | ((formatMessage: FormatMessage) => string | string[])
      }[]
    }
  }
}

export const Cards: FC<FieldBaseProps & Props> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  return (
    <GridRow marginBottom={3}>
      {field.props.cards(application).length ? (
        field.props.cards(application).map(({ title, description }, idx) => {
          return (
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingTop={3}
              key={idx}
            >
              {title && title !== '' ? (
                <ProfileCard
                  heightFull
                  title={title}
                  description={
                    typeof description === 'function'
                      ? description(formatMessage)
                      : description
                  }
                />
              ) : (
                <Text>{formatMessage(m.notFilledOut)}</Text>
              )}
            </GridColumn>
          )
        })
      ) : (
        <GridColumn paddingTop={3}>
          <Text>{formatMessage(m.notFilledOut)}</Text>
        </GridColumn>
      )}
    </GridRow>
  )
}

export default Cards
