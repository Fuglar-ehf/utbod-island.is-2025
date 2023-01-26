import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Stack, Text, Button } from '@island.is/island-ui/core'
import * as styles from './Authenticator.css'

// This screen is unfortunately not translated because at this point we don't
// have a user locale, nor an access token to fetch translations.
const AuthenticatorErrorScreen = () => {
  const navigate = useNavigate()

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      className={styles.fullScreen}
    >
      <Stack space={2} align="center">
        <Text as="h1" variant="h2">
          Óvænt villa
        </Text>
        <Text variant="intro">Innskráning mistókst.</Text>
        <Button variant="primary" onClick={() => navigate('/')}>
          Reyna aftur
        </Button>
      </Stack>
    </Box>
  )
}

export default AuthenticatorErrorScreen
