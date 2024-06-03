import { Colors, Typography } from '@ui'
import { ReactNode } from 'react'
import { Image, View } from 'react-native'
import styled from 'styled-components/native'

type Variant = 'info' | 'error' | 'warning'

export type ProblemTemplateBaseProps = {
  variant: Variant
  title: string
  message: string | ReactNode
  withContainer?: boolean
}

interface WithIconProps extends ProblemTemplateBaseProps {
  showIcon?: boolean
  tag?: never
}

interface WithTagProps extends ProblemTemplateBaseProps {
  tag?: string
  showIcon?: never
}

export type ProblemTemplateProps = WithIconProps | WithTagProps

const getIcon = (variant: Variant) => {
  switch (variant) {
    case 'warning':
      return require('../../assets/icons/warning.png')

    case 'info':
      return require('../../assets/icons/info.png')
  }
}

const getColorsByVariant = (
  variant: Variant,
): {
  borderColor: Colors
  tagBackgroundColor: Colors
  tagColor: Colors
} => {
  switch (variant) {
    case 'error':
      return {
        borderColor: 'red200',
        tagBackgroundColor: 'red100',
        tagColor: 'red600',
      }

    case 'info':
      return {
        borderColor: 'blue200',
        tagBackgroundColor: 'blue100',
        tagColor: 'blue400',
      }

    case 'warning':
      return {
        borderColor: 'yellow400',
        tagBackgroundColor: 'yellow300',
        tagColor: 'dark400',
      }
  }
}

const Host = styled.View<{
  borderColor: Colors
  noContainer?: boolean
}>`
  border-color: ${({ borderColor, theme }) => theme.color[borderColor]};
  border-width: 1px;
  border-radius: 24px;

  justify-content: center;
  align-items: center;
  flex: 1;
  row-gap: ${({ theme }) => theme.spacing[3]}px;

  padding: ${({ theme }) => theme.spacing[2]}px;
  ${({ noContainer, theme }) => noContainer && `margin: ${theme.spacing[2]}px;`}
`

const Tag = styled(Typography)<{
  backgroundColor: Colors
  color?: Colors
}>`
  background-color: ${({ backgroundColor, theme }) =>
    theme.color[backgroundColor]};
  padding: ${({ theme }) => theme.spacing[1]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  overflow: hidden;
  ${({ color, theme }) => color && `color: ${theme.color[color]};`}
`

const Icon = styled(Image)(({ theme }) => ({
  width: theme.spacing[3],
  height: theme.spacing[3],
}))

const Content = styled(View)`
  align-items: center;
  row-gap: ${({ theme }) => theme.spacing[1]}px;
`

export const ProblemTemplate = ({
  variant,
  title,
  message,
  showIcon,
  tag,
  withContainer,
}: ProblemTemplateProps) => {
  const { borderColor, tagColor, tagBackgroundColor } =
    getColorsByVariant(variant)

  return (
    <Host borderColor={borderColor} noContainer={withContainer}>
      {tag && (
        <Tag
          variant="eyebrow"
          backgroundColor={tagBackgroundColor}
          color={tagColor}
        >
          {tag}
        </Tag>
      )}
      {showIcon && <Icon source={getIcon(variant)} />}
      <Content>
        <Typography variant="heading3" textAlign="center">
          {title}
        </Typography>
        <Typography textAlign="center">{message}</Typography>
      </Content>
    </Host>
  )
}
