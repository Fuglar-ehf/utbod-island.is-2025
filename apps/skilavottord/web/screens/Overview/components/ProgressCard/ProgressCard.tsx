import React, { FC } from 'react'
import {
  Box,
  Stack,
  Typography,
  Tag,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import ProgressBar from '../ProgressBar/ProgressBar'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { MockCar } from '@island.is/skilavottord-web/types'

interface ProgressCardProps {
  onClick?: () => void
  car: MockCar
}

export const ProgressCard: FC<ProgressCardProps> = ({
  onClick,
  car: { permno, type, newregdate, status = 'pending' },
}: ProgressCardProps) => {
  const {
    t: { myCars: t },
  } = useI18n()

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const justifyContent = isMobile ? 'flexStart' : 'flexEnd'

  return (
    <OutlinedBox paddingY={4} paddingX={4}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['10/10', '10/10', '10/10', '7/10']}>
            <Stack space={2}>
              <Stack space={1}>
                <Typography variant="h5">{permno}</Typography>
                <Typography variant="p">{`${type}, ${newregdate}`}</Typography>
              </Stack>
              <Box paddingRight={[0, 0, 0, 4]}>
                <ProgressBar progress={status === 'pending' ? 50 : 100} />
              </Box>
            </Stack>
          </GridColumn>
          <GridColumn span={['10/10', '10/10', '10/10', '3/10']}>
            <Box marginTop={[3, 3, 3, 0]}>
              <Stack space={2}>
                <Box display="flex" justifyContent={justifyContent}>
                  <Box>
                    <Tag
                      variant={status === 'pending' ? 'rose' : 'darkerMint'}
                      label
                    >
                      {status === 'pending'
                        ? 'Take to recycling company'
                        : 'Recycled'}
                    </Tag>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  justifyContent={justifyContent}
                  paddingTop={[0, 0, 0, 3]}
                >
                  <Button
                    variant="text"
                    icon="arrowRight"
                    size="small"
                    onClick={onClick}
                  >
                    {status === 'pending'
                      ? t.buttons.openProcess
                      : t.buttons.seeDetails}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </OutlinedBox>
  )
}
