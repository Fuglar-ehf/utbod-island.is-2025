import React, { FC, useCallback, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Divider,
  FocusableBox,
  Hidden,
  Icon,
  Text,
} from '@island.is/island-ui/core'

import * as styles from '../../components/DrivingLicense/DrivingLicense.css'
import { mapCategory } from '../../utils/dataMapper'
import ReactHtmlParser from 'react-html-parser'
import LicenseIcon from '../../components/LicenseIcon/LicenseIcon'
import AnimateHeight from 'react-animate-height'

interface Props {
  licenseIssued?: string
  licenseExpire?: string
  category?: string
  issuedDate?: string
  expireDate?: string
}

const ExpandableLine: FC<Props> = ({
  licenseExpire,
  licenseIssued,
  category,
  issuedDate,
  expireDate,
  children,
}) => {
  useNamespaces('sp.driving-license')
  const { formatMessage } = useLocale()

  const [expanded, toggleExpand] = useState<boolean>(false)
  const [closed, setClosed] = useState<boolean>(true)

  const handleAnimationEnd = useCallback((height) => {
    if (height === 0) {
      setClosed(true)
    } else {
      setClosed(false)
    }
  }, [])

  function onExpandButton() {
    toggleExpand(!expanded)
  }

  return (
    <>
      <Box paddingBottom={3} paddingTop={1}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="spaceBetween"
          width="full"
        >
          <Box display="flex" flexDirection={['column', 'row']}>
            <Box
              display="flex"
              alignItems={['flexStart', 'center']}
              justifyContent={['flexStart', 'center']}
            >
              <Text variant="h5" as="span" lineHeight="lg">
                {category}
              </Text>
              <Box
                display="flex"
                justifyContent="flexEnd"
                alignItems="flexEnd"
                marginLeft={1}
                marginRight={3}
              >
                <LicenseIcon
                  category={mapCategory(category ?? '').icon ?? 'B'}
                />
              </Box>
            </Box>
            <Hidden below="sm">
              <Box className={styles.line} />
            </Hidden>
            <Box
              display="flex"
              alignItems="center"
              justifyContent={['flexStart', 'center']}
              className={styles.content}
              marginLeft={[0, 3]}
            >
              <>
                <Text variant="default">{licenseExpire}</Text>
                <Box marginLeft={1} />
                <Text variant="default" fontWeight="semiBold">
                  {expireDate}
                </Text>
              </>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              className={styles.content}
              marginLeft={[0, 3]}
            >
              <>
                <Text variant="default">{licenseIssued}</Text>
                <Box marginLeft={1} />
                <Text variant="default" fontWeight="semiBold">
                  {issuedDate}
                </Text>
              </>
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent={['flexStart', 'flexEnd']}
            alignItems="center"
          >
            <FocusableBox
              borderRadius="circle"
              background="blue100"
              onClick={onExpandButton}
              padding={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
            >
              <Icon
                type="filled"
                icon={expanded ? 'remove' : 'add'}
                color="blue400"
              />
            </FocusableBox>
          </Box>
        </Box>
        <AnimateHeight
          className={expanded ? styles.animatedContent : undefined}
          onAnimationEnd={(props: { newHeight: number }) =>
            handleAnimationEnd(props.newHeight)
          }
          duration={300}
          height={expanded ? 'auto' : 0}
        >
          <Box className={styles.text}>{children}</Box>
        </AnimateHeight>
      </Box>
      <Divider />
    </>
  )
}

export default ExpandableLine
