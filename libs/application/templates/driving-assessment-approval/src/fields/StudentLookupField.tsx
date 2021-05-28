import React, { FC } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useWatch } from 'react-hook-form'
import { CustomField, FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import * as kennitala from 'kennitala'

const QUERY = gql`
  query studentInfo($nationalId: String!) {
    drivingLicenseStudentInformation(nationalId: $nationalId) {
      student {
        name
      }
    }
  }
`

interface Props extends FieldBaseProps {
  field: CustomField
}

export const StudentLookupField: FC<Props> = ({ error }) => {
  const studentNationalId = useWatch({
    name: 'student.nationalId',
  })

  const { data = {}, error: queryError, loading } = useQuery(QUERY, {
    skip:
      !studentNationalId || !kennitala.isPerson(studentNationalId as string),
    variables: {
      nationalId: studentNationalId,
    },
  })

  if (queryError) {
    return <Text>Villa kom upp við að sækja upplýsingar um nemanda</Text>
  }

  if (loading) {
    return <Text>Sæki upplýsingar um nemanda... </Text>
  }

  if (!data?.drivingLicenseStudentInformation) {
    return null
  }

  const result = data.drivingLicenseStudentInformation

  return (
    <>
      {error && { error }}

      {result.student ? (
        <Box>
          <Text variant="h4">Umsækjandi</Text>
          <Text>{result.student.name}</Text>
        </Box>
      ) : (
        <Box color="red400" padding={2}>
          <Text color="red400">
            Kennitala fannst ekki eða nemandi er ekki með bráðabyrgðaskírteini
          </Text>
        </Box>
      )}
    </>
  )
}
