import React, { useEffect } from 'react'

import {
  Typography,
  Button,
  Box,
  AlertMessage,
} from '@island.is/island-ui/core'
import { apiUrl } from '../../api'
import * as styles from './Login.treat'

export const Login = () => {
  const urlParams = new URLSearchParams(window.location.search)

  useEffect(() => {
    document.title = 'Réttarvörslugátt'
  }, [])

  return (
    <div className={styles.loginContainer}>
      {urlParams.has('error') && (
        <div className={styles.errorMessage}>
          <Box marginBottom={6}>
            <AlertMessage
              type="info"
              title="Innskráning ógild"
              message="Innskráning ekki lengur gild. Vinsamlegast reynið aftur."
            />
          </Box>
        </div>
      )}
      <div className={styles.titleContainer}>
        <Box>
          <Typography as="h1" variant="h1">
            Skráðu þig inn í Réttarvörslugátt
          </Typography>
        </Box>
      </div>
      <div className={styles.subTitleContainer}>
        <Typography>
          Notaðu rafræn skilríki til þess að skrá þig inn. Passaðu upp á að það
          sé kveikt á símanum eða hann sé ólæstur.
        </Typography>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          href={`${apiUrl}/api/auth/login?returnUrl=/gaesluvardhaldskrofur`}
          width="fluid"
        >
          Innskráning
        </Button>
      </div>
    </div>
  )
}

export default Login
