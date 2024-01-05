import { FC, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, GenericFormField } from '@island.is/application/types'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import * as kennitala from 'kennitala'
import { EstateRegistrant } from '@island.is/clients/syslumenn'
import { Answers, EstateMember } from '../../types'
import { AdditionalEstateMember } from './AdditionalEstateMember'
import { getValueViaPath } from '@island.is/application/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { format as formatNationalId } from 'kennitala'
import {
  EstateTypes,
  heirAgeValidation,
  relationWithApplicant,
} from '../../lib/constants'
import intervalToDuration from 'date-fns/intervalToDuration'

export const EstateMembersRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers>>
> = ({ application, field, errors, setBeforeSubmitCallback }) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { getValues, setError } = useFormContext()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })
  const values = getValues()
  const selectedEstate = application.answers.selectedEstate

  const hasEstateMemberUnder18 = values.estate?.estateMembers?.some(
    (member: EstateMember) => {
      const hasForeignCitizenship = member?.foreignCitizenship?.[0] === 'yes'
      const birthDate = member?.dateOfBirth
      const memberAge =
        hasForeignCitizenship && birthDate
          ? intervalToDuration({ start: new Date(birthDate), end: new Date() })
              ?.years
          : kennitala.info(member.nationalId)?.age
      return (
        (memberAge ?? 0) < 18 &&
        (member?.nationalId || birthDate) &&
        member.enabled
      )
    },
  )

  const hasEstateMemberUnder18withoutRep = values.estate?.estateMembers?.some(
    (member: EstateMember) => {
      const advocateAge =
        member.advocate && kennitala.info(member.advocate.nationalId)?.age
      return (
        hasEstateMemberUnder18 &&
        member?.advocate?.nationalId &&
        advocateAge &&
        advocateAge < 18
      )
    },
  )

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      if (
        hasEstateMemberUnder18withoutRep &&
        selectedEstate !== EstateTypes.divisionOfEstateByHeirs
      ) {
        setError(heirAgeValidation, {
          type: 'custom',
        })
        return [false, 'invalid advocate age']
      }

      if (
        hasEstateMemberUnder18 &&
        selectedEstate === EstateTypes.divisionOfEstateByHeirs
      ) {
        setError(heirAgeValidation, {
          type: 'custom',
        })
        return [false, 'invalid member age']
      }

      return [true, null]
    })

  const { clearErrors } = useFormContext()

  const externalData = application.externalData.syslumennOnEntry?.data as {
    relationOptions: string[]
    estate: EstateRegistrant
  }

  const relationsWithApplicant = relationWithApplicant.map((relation) => ({
    value: relation,
    label: relation,
  }))

  const relations =
    externalData.relationOptions?.map((relation) => ({
      value: relation,
      label: relation,
    })) || []
  const error = (errors as any)?.estate?.estateMembers

  const handleAddMember = () =>
    append({
      nationalId: undefined,
      initial: false,
      enabled: true,
      name: undefined,
    })

  useEffect(() => {
    if (
      !hasEstateMemberUnder18 &&
      selectedEstate !== EstateTypes.divisionOfEstateByHeirs
    ) {
      clearErrors(heirAgeValidation)
    }
    if (!hasEstateMemberUnder18withoutRep) {
      clearErrors(heirAgeValidation)
    }
  }, [
    fields,
    hasEstateMemberUnder18withoutRep,
    hasEstateMemberUnder18,
    clearErrors,
  ])

  useEffect(() => {
    if (fields.length === 0 && externalData.estate.estateMembers) {
      // ran into a problem with "append", as it appeared to be getting called multiple times
      // despite checking on the length of the fields
      // so now using "replace" instead, for the initial setup
      replace(externalData.estate.estateMembers)
    }
  }, [])

  return (
    <Box>
      {fields.reduce((acc, member: GenericFormField<EstateMember>, index) => {
        if (member.nationalId === application.applicant) {
          const relation = getValueViaPath<string>(
            application.answers,
            'applicantRelation',
          )
          if (relation && relation !== member.relation) {
            member.relation = relation
          }
        }
        if (!member.initial) {
          return acc
        }
        return [
          ...acc,
          <Box marginTop={index > 0 ? 7 : 0} key={index}>
            <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
              <Text variant="h4">{formatMessage(m.estateMember)}</Text>
              <Box>
                <Button
                  variant="text"
                  size="small"
                  icon={member.enabled ? 'remove' : 'add'}
                  onClick={() => {
                    const updatedMember = {
                      ...member,
                      enabled: !member.enabled,
                    }
                    update(index, updatedMember)
                    clearErrors(`${id}[${index}].phone`)
                    clearErrors(`${id}[${index}].email`)
                    clearErrors(`${id}[${index}].advocate.phone`)
                    clearErrors(`${id}[${index}].advocate.email`)
                  }}
                >
                  {member.enabled
                    ? formatMessage(m.inheritanceDisableMember)
                    : formatMessage(m.inheritanceEnableMember)}
                </Button>
              </Box>
            </Box>
            <GridRow>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${id}[${index}].nationalId`}
                  name={`${id}[${index}].nationalId`}
                  label={formatMessage(m.inheritanceKtLabel)}
                  defaultValue={formatNationalId(member.nationalId || '')}
                  backgroundColor="white"
                  disabled={!member.enabled}
                  format={'######-####'}
                  error={error && error[index] && error[index].nationalId}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${id}[${index}].name`}
                  name={`${id}[${index}].name`}
                  label={formatMessage(m.inheritanceNameLabel)}
                  readOnly
                  defaultValue={member.name || ''}
                  backgroundColor="white"
                  disabled={!member.enabled}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${id}[${index}].relation`}
                  name={`${id}[${index}].relation`}
                  label={formatMessage(m.inheritanceRelationLabel)}
                  readOnly
                  defaultValue={member.relation}
                  backgroundColor="white"
                  disabled={!member.enabled}
                />
              </GridColumn>
              {application.answers.selectedEstate ===
                EstateTypes.permitForUndividedEstate &&
                member.relation !== 'Maki' && (
                  <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                    <SelectController
                      id={`${id}[${index}].relationWithApplicant`}
                      name={`${id}[${index}].relationWithApplicant`}
                      label={formatMessage(
                        m.inheritanceRelationWithApplicantLabel,
                      )}
                      defaultValue={member.relationWithApplicant}
                      options={relationsWithApplicant}
                      error={error?.relationWithApplicant}
                      backgroundColor="blue"
                      disabled={!member.enabled}
                      required
                    />
                  </GridColumn>
                )}
              {!member.advocate && (
                <>
                  <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                    <InputController
                      id={`${id}[${index}].email`}
                      name={`${id}[${index}].email`}
                      label={formatMessage(m.email)}
                      backgroundColor="blue"
                      disabled={!member.enabled}
                      defaultValue={member.email || ''}
                      error={error && error[index] && error[index].email}
                      required
                    />
                  </GridColumn>
                  <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                    <InputController
                      id={`${id}[${index}].phone`}
                      name={`${id}[${index}].phone`}
                      label={formatMessage(m.phone)}
                      backgroundColor="blue"
                      disabled={!member.enabled}
                      format="###-####"
                      defaultValue={member.phone || ''}
                      error={error && error[index] && error[index].phone}
                      required
                    />
                  </GridColumn>
                </>
              )}
            </GridRow>

            {/* ADVOCATE */}
            {member.advocate && (
              <Box
                marginTop={2}
                paddingY={5}
                paddingX={7}
                borderRadius="large"
                border="standard"
              >
                <GridRow>
                  <GridColumn span={['1/1']} paddingBottom={2}>
                    <Text
                      variant="h4"
                      color={member.enabled ? 'dark400' : 'dark300'}
                    >
                      {formatMessage(m.inheritanceAdvocateLabel)}
                    </Text>
                  </GridColumn>
                  <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                    <InputController
                      id={`${id}[${index}].advocate.nationalId`}
                      name={`${id}[${index}].advocate.nationalId`}
                      label={formatMessage(m.inheritanceKtLabel)}
                      readOnly
                      defaultValue={formatNationalId(
                        member.advocate?.nationalId || '',
                      )}
                      backgroundColor="white"
                      disabled={!member.enabled}
                      format={'######-####'}
                      size="sm"
                    />
                  </GridColumn>
                  <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                    <InputController
                      id={`${id}[${index}].advocate.name`}
                      name={`${id}[${index}].advocate.name`}
                      label={formatMessage(m.inheritanceNameLabel)}
                      readOnly
                      defaultValue={member.advocate?.name || ''}
                      backgroundColor="white"
                      disabled={!member.enabled}
                      size="sm"
                    />
                  </GridColumn>
                  <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                    <InputController
                      id={`${id}[${index}].advocate.phone`}
                      name={`${id}[${index}].advocate.phone`}
                      label={formatMessage(m.phone)}
                      backgroundColor="blue"
                      disabled={!member.enabled}
                      format="###-####"
                      defaultValue={member.advocate?.phone || ''}
                      error={
                        error && error[index] && error[index].advocate?.phone
                      }
                      size="sm"
                      required
                    />
                  </GridColumn>
                  <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                    <InputController
                      id={`${id}[${index}].advocate.email`}
                      name={`${id}[${index}].advocate.email`}
                      label={formatMessage(m.email)}
                      backgroundColor="blue"
                      disabled={!member.enabled}
                      defaultValue={member.advocate?.email || ''}
                      error={
                        error && error[index] && error[index].advocate?.email
                      }
                      size="sm"
                      required
                    />
                  </GridColumn>
                </GridRow>
              </Box>
            )}
          </Box>,
        ]
      }, [] as JSX.Element[])}
      {fields.map((member: GenericFormField<EstateMember>, index) => {
        return (
          <Box key={member.id} hidden={member.initial}>
            <AdditionalEstateMember
              application={application}
              field={member}
              fieldName={id}
              index={index}
              relationOptions={relations}
              relationWithApplicantOptions={relationsWithApplicant}
              remove={remove}
              error={error && error[index] ? error[index] : null}
            />
          </Box>
        )
      })}

      <Box marginTop={3}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddMember}
          size="small"
        >
          {formatMessage(m.inheritanceAddMember)}
        </Button>
      </Box>
      {errors && errors[heirAgeValidation] ? (
        <Box marginTop={4}>
          <InputError
            errorMessage={
              selectedEstate === EstateTypes.divisionOfEstateByHeirs
                ? formatMessage(m.inheritanceAgeValidation)
                : formatMessage(m.heirAdvocateAgeValidation)
            }
          />
        </Box>
      ) : null}
    </Box>
  )
}

export default EstateMembersRepeater
