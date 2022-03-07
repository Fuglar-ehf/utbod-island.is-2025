import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Button, Hidden, Tag, Text } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './DrivingLicense.css'
import { getExpiresIn, toDate } from '../../utils/dateUtils'
import { ServicePortalPath } from '@island.is/service-portal/core'
import QRCodeModal from '../../components/QRCodeModal/QRCodeModal'

export const DrivingLicense = ({
  id,
  expireDate,
}: {
  id: string
  expireDate: string
}) => {
  useNamespaces('sp.driving-license')
  const { formatMessage } = useLocale()
  const [modalOpen, setModalOpen] = useState(false)
  const [currentDate] = useState(new Date())

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }
  const drivingLicenceImg =
    'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg?w=100&h=100&fit=pad&bg=white&fm=png'

  const expiresIn = getExpiresIn(currentDate, new Date(expireDate))
  return (
    <>
      <Box
        border="standard"
        borderRadius="large"
        padding={4}
        display="flex"
        flexDirection="row"
      >
        <Hidden below="sm">
          <img
            className={styles.image}
            src={drivingLicenceImg}
            alt={formatMessage({
              id: 'sp.driving-license:license',
              defaultMessage: 'Ökuréttindi',
            })}
          />
        </Hidden>
        <Box
          display="flex"
          flexDirection="column"
          width="full"
          paddingLeft={[0, 2]}
        >
          <Box
            display="flex"
            flexDirection={['column', 'column', 'column', 'row']}
            justifyContent="spaceBetween"
            alignItems="flexStart"
          >
            <Text variant="h4" as="h2">
              {formatMessage({
                id: 'sp.driving-license:license',
                defaultMessage: 'Ökuréttindi',
              })}
            </Text>
            <Box
              display="flex"
              flexDirection={['column', 'column', 'row']}
              alignItems={['flexStart', 'flexStart', 'flexEnd']}
              justifyContent="flexEnd"
              textAlign="right"
              marginBottom={1}
            >
              {expiresIn && (
                <Box paddingRight={1} paddingTop={[1, 0]}>
                  {expiresIn.value <= 0 ? (
                    <Tag disabled variant="red">
                      {formatMessage({
                        id: 'sp.driving-license:expired',
                        defaultMessage: 'Útrunnið',
                      })}
                    </Tag>
                  ) : (
                    <Tag disabled variant="red">
                      {formatMessage({
                        id: 'sp.driving-license:expires-in',
                        defaultMessage: 'Rennur út innan ',
                      })}
                      {Math.round(expiresIn.value)}
                      {expiresIn.key === 'months'
                        ? formatMessage({
                            id: 'sp.driving-license:months',
                            defaultMessage: ' mánaða',
                          })
                        : formatMessage({
                            id: 'sp.driving-license:days',
                            defaultMessage: ' daga',
                          })}
                    </Tag>
                  )}
                </Box>
              )}
              <Box paddingTop={expiresIn ? [1, 1, 0] : undefined}>
                <Tag disabled variant="blue">
                  {formatMessage({
                    id: 'sp.driving-license:valid-until',
                    defaultMessage: 'Í gildi til ',
                  })}
                  {toDate(new Date(expireDate).getTime().toString())}
                </Tag>
              </Box>
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection={['column', 'row']}
            justifyContent={'spaceBetween'}
            paddingTop={[1, 0]}
          >
            <Box className={styles.flexShrink}>
              <Text>
                {formatMessage({
                  id: 'sp.driving-license:license-number',
                  defaultMessage: 'Númer ökuskírteinis',
                })}
                {' - '}
                {id}
              </Text>
            </Box>
            <Box
              display="flex"
              flexDirection={['column', 'row']}
              justifyContent={'flexEnd'}
              alignItems={['flexStart', 'center']}
              className={styles.flexGrow}
              paddingTop={[1, 0]}
            >
              <Button
                variant="text"
                size="small"
                icon="QRCode"
                iconType="outline"
                onClick={toggleModal}
              >
                {formatMessage({
                  id: 'sp.driving-license:send-to-phone',
                  defaultMessage: 'Senda í síma',
                })}
              </Button>
              <Hidden below="sm">
                <Box className={styles.line} marginLeft={2} marginRight={2} />
              </Hidden>
              <Link
                to={{
                  pathname: ServicePortalPath.LicensesDrivingDetail.replace(
                    ':id',
                    id,
                  ),
                }}
              >
                <Box paddingTop={[1, 0]}>
                  <Button variant="text" size="small" icon="arrowForward">
                    {formatMessage({
                      id: 'sp.driving-license:see-more',
                      defaultMessage: 'Skoða upplýsingar',
                    })}
                  </Button>
                </Box>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
      <QRCodeModal
        id="qrcode-modal"
        toggleClose={modalOpen}
        onCloseModal={toggleModal}
        expires={toDate(new Date(expireDate).getTime().toString())}
      />
    </>
  )
}

export default DrivingLicense
