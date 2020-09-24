import React, { FC } from 'react'
import {
  Stack,
  Typography,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
  Box,
  Link,
} from '@island.is/island-ui/core'
import * as styles from './CompanyListItem.treat'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

export interface CompanyProps {
  name?: string
  address?: string
  phone?: string
  website?: string
}

export const CompanyListItem: FC<CompanyProps> = ({
  name,
  address,
  phone,
  website,
}: CompanyProps) => {
  const {
    t: { handover: t },
  } = useI18n()

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  return (
    <Box padding={3} className={styles.container}>
      <Stack space={2}>
        <GridContainer>
          <GridRow>
            <GridColumn span={['10/10', '7/10', '7/10', '7/10']}>
              <Stack space={1}>
                <Typography variant="h5">{name}</Typography>
                <Typography variant="p">{address}</Typography>
                <Typography variant="p">{phone}</Typography>
                <Link href={website} color="blue400">
                  {website}
                </Link>
              </Stack>
            </GridColumn>
            <GridColumn span={['10/10', '3/10', '3/10', '3/10']}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="full"
              >
                <Link href={website} passHref>
                  <Button
                    size="small"
                    variant="ghost"
                    width={isMobile ? 'fluid' : 'normal'}
                  >
                    {t.buttons.website}
                  </Button>
                </Link>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Stack>
    </Box>
  )
}

export default CompanyListItem
