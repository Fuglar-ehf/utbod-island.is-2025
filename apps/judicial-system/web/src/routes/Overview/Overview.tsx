import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import {
  GridContainer,
  GridRow,
  Box,
  GridColumn,
  Typography,
  Accordion,
  AccordionItem,
} from '@island.is/island-ui/core'
import { ProsecutorLogo } from '../../shared-components/Logos'
import Modal from '../../shared-components/Modal/Modal'
import { formatDate, capitalize } from '../../utils/formatters'
import is from 'date-fns/locale/is'
import {
  getRestrictionByValue,
  renderRestrictons,
} from '../../utils/stepHelper'
import { CustodyRestrictions } from '../../types'
import { FormFooter } from '../../shared-components/FormFooter'
import * as Constants from '../../utils/constants'
import * as api from '../../api'
import * as styles from './Overview.treat'

export const Overview: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [isSendingNotification, setIsSendingNotification] = useState(false)

  const caseDraft = window.localStorage.getItem('workingCase')
  const caseDraftJSON = JSON.parse(caseDraft)
  const history = useHistory()

  const renderAccusedName = () => (
    <Typography>
      Tilkynning hefur verið send á dómara á vakt.
      <br />
      Dómstóll: {caseDraftJSON.court}.
      <br />
      Sakborningur:
      <span className={styles.accusedName}>
        {` ${caseDraftJSON.accusedName}`}
      </span>
      .
    </Typography>
  )

  const handleNextButtonClick = async () => {
    try {
      setIsSendingNotification(true)
      await api.sendNotification(caseDraftJSON.id)
      setIsSendingNotification(false)
      return true
    } catch (e) {
      return false
    }
  }

  return caseDraftJSON ? (
    <>
      <Box marginTop={7} marginBottom={30}>
        <GridContainer>
          <GridRow>
            <GridColumn span={'3/12'}>
              <ProsecutorLogo />
            </GridColumn>
            <GridColumn span={'8/12'} offset={'1/12'}>
              <Typography as="h1" variant="h1">
                Krafa um gæsluvarðhald
              </Typography>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '3/12']}>
              <Typography>Hliðarstika</Typography>
            </GridColumn>
            <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    LÖKE málsnúmer
                  </Typography>
                </Box>
                <Typography>{caseDraftJSON.policeCaseNumber}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Fullt nafn kærða
                  </Typography>
                </Box>
                <Typography>{caseDraftJSON.accusedName}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Lögheimili/dvalarstaður
                  </Typography>
                </Box>
                <Typography>{caseDraftJSON.accusedAddress}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Dómstóll
                  </Typography>
                </Box>
                <Typography>{caseDraftJSON.court}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Tími handtöku
                  </Typography>
                </Box>
                <Typography>
                  {`${capitalize(
                    formatDate(caseDraftJSON?.arrestDate, 'PPPP', {
                      locale: is,
                    }),
                  )} kl. ${formatDate(
                    caseDraftJSON?.arrestDate,
                    Constants.TIME_FORMAT,
                  )}`}
                </Typography>
              </Box>
              {caseDraftJSON.requestedCourtDate &&
                caseDraftJSON.requestedCourtTime && (
                  <Box component="section" marginBottom={5}>
                    <Box marginBottom={1}>
                      <Typography variant="eyebrow" color="blue400">
                        Ósk um fyrirtökudag og tíma
                      </Typography>
                    </Box>
                    <Typography>
                      {`${capitalize(
                        formatDate(caseDraftJSON?.requestedCourtDate, 'PPPP', {
                          locale: is,
                        }),
                      )} kl. ${formatDate(
                        caseDraftJSON?.requestedCourtDate,
                        Constants.TIME_FORMAT,
                      )}`}
                    </Typography>
                  </Box>
                )}
              <Box component="section" marginBottom={5}>
                <Accordion>
                  <AccordionItem id="id_1" label="Dómkröfur">
                    <Typography variant="p" as="p">
                      Gæsluvarðhald til
                      <strong>
                        {` ${formatDate(
                          caseDraftJSON?.requestedCustodyEndDate,
                          'PPP',
                          { locale: is },
                        )} kl. ${formatDate(
                          caseDraftJSON?.requestedCustodyEndDate,
                          Constants.TIME_FORMAT,
                        )}`}
                      </strong>
                    </Typography>
                  </AccordionItem>
                  <AccordionItem id="id_2" label="Lagaákvæði">
                    <Typography variant="p" as="p">
                      {caseDraftJSON.lawsBroken}
                    </Typography>
                  </AccordionItem>
                  <AccordionItem id="id_3" label="Takmarkanir á gæslu">
                    <Typography variant="p" as="p">
                      {renderRestrictons(
                        caseDraftJSON.requestedCustodyRestrictions,
                      )}
                    </Typography>
                  </AccordionItem>
                  <AccordionItem
                    id="id_4"
                    label="Greinagerð um málsatvik og lagarök"
                  >
                    {caseDraftJSON.caseFacts && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">Málsatvik rakin</Typography>
                        </Box>
                        <Typography>{caseDraftJSON.caseFacts}</Typography>
                      </Box>
                    )}
                    {caseDraftJSON.witnessAccounts && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">Framburður</Typography>
                        </Box>
                        <Typography>{caseDraftJSON.witnessAccounts}</Typography>
                      </Box>
                    )}
                    {caseDraftJSON.investigationProgress && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">
                            Staða rannsóknar og næstu skref
                          </Typography>
                        </Box>
                        <Typography>
                          {caseDraftJSON.investigationProgress}
                        </Typography>
                      </Box>
                    )}
                    {caseDraftJSON.legalArguments && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">Lagarök</Typography>
                        </Box>
                        <Typography>{caseDraftJSON.legalArguments}</Typography>
                      </Box>
                    )}
                  </AccordionItem>
                </Accordion>
              </Box>
              <FormFooter
                previousUrl={Constants.STEP_TWO_ROUTE}
                nextUrl="/"
                nextButtonText="Staðfesta kröfu fyrir héraðsdóm"
                onNextButtonClick={() => {
                  const didSendNotification = handleNextButtonClick()
                  if (didSendNotification) {
                    setModalVisible(true)
                  } else {
                    // TODO: Handle error
                  }
                }}
                confirmationText="Með því að ýta á þennan hnapp fær dómari á vakt tilkynningu um að krafan sé tilbúin."
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      {modalVisible && (
        <Modal
          title="Krafa um gæsluvarðhald hefur verið staðfest"
          text={renderAccusedName() as JSX.Element}
          handleClose={() => history.push(Constants.DETENTION_REQUESTS_ROUTE)}
          handlePrimaryButtonClick={async () => {
            history.push(Constants.DETENTION_REQUESTS_ROUTE)
          }}
          primaryButtonText="Loka glugga og fara í yfirlit krafna"
        />
      )}
    </>
  ) : null
}

export default Overview
