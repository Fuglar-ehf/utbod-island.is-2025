import * as React from 'react'
import { Typography } from '../Typography/Typography'
import { Input } from '../Input/Input'
import { Button } from '../Button/Button'

import * as styles from './NewsletterSignup.treat'
import { Box } from '../Box/Box'

type ColorVariant = 'white' | 'blue'
type State = 'default' | 'error' | 'success'

interface Props {
  heading: string
  text: string
  id?: string
  placeholder: string
  label: string
  buttonText: string
  variant?: ColorVariant
  state?: State
  errorMessage?: string
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onSubmit: (event: React.FormEvent<unknown>) => void
  value: string
}

export const NewsletterSignup: React.FC<Props> = ({
  heading,
  text,
  id = 'newsletter',
  placeholder,
  label,
  buttonText,
  variant = 'white',
  state = 'default',
  onChange,
  onSubmit,
  value,
  errorMessage,
}) => {
  return (
    <Box className={styles.variants[variant]}>
      <Typography variant="h3" as="h3" color="blue400" paddingBottom={1}>
        {heading}
      </Typography>
      <Typography variant="p" paddingBottom={3}>
        {text}
      </Typography>
      <Box display="flex" flexDirection={['column', 'column', 'row']}>
        <Box className={styles.inputWrap}>
          <Input
            id={id}
            name={id}
            value={value}
            placeholder={placeholder}
            label={label}
            backgroundColor={variant === 'white' ? 'blue' : 'white'}
            hasError={state === 'error'}
            errorMessage={errorMessage}
            onChange={onChange}
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          className={styles.buttonWrap}
          paddingTop={[3, 2, 0]}
          marginLeft={[0, 0, 8]}
        >
          <Box>
            <Button as="span" onClick={onSubmit} variant="text">
              {buttonText}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
