import React from 'react'

import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { Box, Button } from '@island.is/island-ui/core'
import { EducationCard } from '@island.is/service-portal/core'

const EducationLicenseQuery = gql`
  query EducationLicenseQuery {
    educationLicense {
      id
      school
      programme
      date
    }
  }
`

const LicenseCards = () => {
  const { data } = useQuery<Query>(EducationLicenseQuery)
  const { educationLicense = [] } = data || {}
  return (
    <>
      {educationLicense.map((license, index) => (
        <Box marginBottom={3} key={index}>
          <EducationCard
            eyebrow={license.school}
            imgPlaceholder={'MRN'}
            title={`Leyfisbréf - ${license.programme}`}
            description={license.date}
            CTA={
              <Button variant="text" icon="download" iconType="outline" nowrap>
                Sækja skjal
              </Button>
            }
          />
        </Box>
      ))}
    </>
  )
}

export default LicenseCards
