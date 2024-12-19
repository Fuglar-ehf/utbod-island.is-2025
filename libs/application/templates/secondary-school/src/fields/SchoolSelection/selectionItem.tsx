import { FieldBaseProps, YES } from '@island.is/application/types'
import { AlertMessage, Box, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FC, useState, useCallback, useEffect } from 'react'
import { school } from '../../lib/messages'
import {
  ApplicationType,
  getTranslatedProgram,
  Language,
  Program,
  SecondarySchool,
} from '../../utils'
import { Controller, useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { useLazyProgramList } from '../../hooks/useLazyProgramList'

type Option = {
  value: string
  label: string
}

export const SelectionItem: FC<FieldBaseProps> = (props) => {
  const { formatMessage, lang } = useLocale()
  const { application, setFieldLoadingState } = props
  const { setValue } = useFormContext()
  const [isLoadingPrograms, setIsLoadingPrograms] = useState<boolean>(false)

  const isFreshman =
    getValueViaPath<ApplicationType>(application.answers, 'applicationType') ===
    ApplicationType.FRESHMAN

  // options for dropdowns
  const schoolOptions = getValueViaPath<SecondarySchool[]>(
    application.externalData,
    'schools.data',
  )
  const [programOptions, setProgramOptions] = useState<Program[]>([])
  const [thirdLanguageOptions, setThirdLanguageOptions] = useState<Language[]>(
    [],
  )
  const [nordicLanguageOptions, setNordicLanguageOptions] = useState<
    Language[]
  >([])

  // state variables for values in dropdown that use Controller + Select
  const [selectedFirstProgram, setSelectedFirstProgram] =
    useState<Option | null>(null)
  const [selectedSecondProgram, setSelectedSecondProgram] =
    useState<Option | null>(null)
  const [selectedThirdLanguage, setSelectedThirdLanguage] =
    useState<Option | null>(null)
  const [selectedNordicLanguage, setSelectedNordicLanguage] =
    useState<Option | null>(null)

  // get values from answers (to initialize dropdowns)
  const schoolIdAnswer = getValueViaPath<string | undefined>(
    application.answers,
    `${props.field.id}.school.id`,
  )
  const firstProgramIdAnswer = getValueViaPath<string | undefined>(
    application.answers,
    `${props.field.id}.firstProgram.id`,
  )
  const secondProgramIdAnswer = getValueViaPath<string | undefined>(
    application.answers,
    `${props.field.id}.secondProgram.id`,
  )
  const thirdLanguageCodeAnswer = getValueViaPath<string | undefined>(
    application.answers,
    `${props.field.id}.thirdLanguage.code`,
  )
  const nordicLanguageCodeAnswer = getValueViaPath<string | undefined>(
    application.answers,
    `${props.field.id}.nordicLanguage.code`,
  )

  // callback to get programs per school id
  const getProgramList = useLazyProgramList()
  const getProgramListCallback = useCallback(
    async (schoolId: string) => {
      const { data } = await getProgramList({
        schoolId,
      })
      return data
    },
    [getProgramList],
  )

  // initialize values and options in dropdowns
  // Note: need to keep the values in state variables, and then initialize them here
  // because we are using Controller + Select (instead of SelectController)
  // We are doing that to be able to clear the field when changing the school selection
  useEffect(() => {
    // if school is set in answers, then initialize selections and options in dropdowns
    if (schoolIdAnswer) {
      // fetch programs per school
      setIsLoadingPrograms(true)
      getProgramListCallback(schoolIdAnswer)
        .then((response) => {
          const programs = response.secondarySchoolProgramsBySchoolId

          // initialize values in dropdowns:

          const schoolInfo = schoolOptions?.find((x) => x.id === schoolIdAnswer)

          const firstProgramInfo = programs.find(
            (x) => x.id === firstProgramIdAnswer,
          )
          if (firstProgramInfo) {
            setSelectedFirstProgram({
              value: firstProgramInfo.id,
              label: getTranslatedProgram(lang, firstProgramInfo),
            })
          }

          const secondProgramInfo = programs.find(
            (x) => x.id === secondProgramIdAnswer,
          )
          if (secondProgramInfo) {
            setSelectedSecondProgram({
              value: secondProgramInfo.id,
              label: getTranslatedProgram(lang, secondProgramInfo),
            })
          }

          const thirdLanguageInfo = schoolInfo?.thirdLanguages?.find(
            (x) => x.code === thirdLanguageCodeAnswer,
          )
          if (thirdLanguageInfo) {
            setSelectedThirdLanguage({
              value: thirdLanguageInfo.code,
              label: thirdLanguageInfo.name,
            })
          }

          const nordicLanguageInfo = schoolInfo?.nordicLanguages?.find(
            (x) => x.code === nordicLanguageCodeAnswer,
          )
          if (nordicLanguageInfo) {
            setSelectedNordicLanguage({
              value: nordicLanguageInfo.code,
              label: nordicLanguageInfo.name,
            })
          }

          // initialize options in dropdowns:
          setProgramOptions(programs)
          setThirdLanguageOptions(schoolInfo?.thirdLanguages || [])
          setNordicLanguageOptions(schoolInfo?.nordicLanguages || [])
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setIsLoadingPrograms(false)
        })
    }
  }, [
    getProgramListCallback,
    schoolIdAnswer,
    firstProgramIdAnswer,
    secondProgramIdAnswer,
    thirdLanguageCodeAnswer,
    nordicLanguageCodeAnswer,
    schoolOptions,
    lang,
  ])

  const selectSchool = (option: Option) => {
    setValueSchool(option?.value)

    const schoolId = option.value
    const schoolInfo = schoolOptions?.find((x) => x.id === schoolId)

    setIsLoadingPrograms(true)
    getProgramListCallback(schoolId)
      .then((response) => {
        const programs = response.secondarySchoolProgramsBySchoolId

        // clear values in dropdowns (and checkbox value)
        setSelectedFirstProgram(null)
        setValueProgram('firstProgram', undefined)
        setSelectedSecondProgram(null)
        setValueProgram('secondProgram', undefined)
        setSelectedThirdLanguage(null)
        setValueThirdLanguage(undefined)
        setSelectedNordicLanguage(null)
        setValueNordicLanguage(undefined)
        setValueRequestDormitoryEmpty()

        // update options in dropdowns
        setProgramOptions(programs)
        setThirdLanguageOptions(schoolInfo?.thirdLanguages || [])
        setNordicLanguageOptions(schoolInfo?.nordicLanguages || [])
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoadingPrograms(false)
      })
  }

  const setValueSchool = (schoolId: string | undefined) => {
    const schoolInfo = schoolOptions?.find((x) => x.id === schoolId)
    setValue(`${props.field.id}.school.id`, schoolInfo?.id)
    setValue(`${props.field.id}.school.name`, schoolInfo?.name)
  }

  const setValueProgram = (
    fieldName: string,
    programId: string | undefined,
  ) => {
    const programInfo = programOptions.find((x) => x.id === programId)
    setValue(`${props.field.id}.${fieldName}.id`, programInfo?.id || '')
    setValue(`${props.field.id}.${fieldName}.nameIs`, programInfo?.nameIs || '')
    setValue(`${props.field.id}.${fieldName}.nameEn`, programInfo?.nameEn || '')
    setValue(
      `${props.field.id}.${fieldName}.registrationEndDate`,
      programInfo?.registrationEndDate || '',
    )
  }

  const setValueThirdLanguage = (languageCode: string | undefined) => {
    const languageInfo = thirdLanguageOptions.find(
      (x) => x.code === languageCode,
    )
    setValue(`${props.field.id}.thirdLanguage.code`, languageInfo?.code || '')
    setValue(`${props.field.id}.thirdLanguage.name`, languageInfo?.name || '')
  }

  const setValueNordicLanguage = (languageCode: string | undefined) => {
    const languageInfo = nordicLanguageOptions.find(
      (x) => x.code === languageCode,
    )
    setValue(`${props.field.id}.nordicLanguage.code`, languageInfo?.code || '')
    setValue(`${props.field.id}.nordicLanguage.name`, languageInfo?.name || '')
  }

  const setValueRequestDormitoryEmpty = () => {
    setValue(`${props.field.id}.requestDormitory`, [])
  }

  // default set include=true for second program if freshman
  useEffect(() => {
    setValue(`${props.field.id}.secondProgram.include`, isFreshman)
  }, [isFreshman, props.field.id, setValue])

  useEffect(() => {
    setFieldLoadingState?.(isLoadingPrograms)
  }, [isLoadingPrograms, setFieldLoadingState])

  return (
    <Box>
      <Box marginTop={2}>
        <SelectController
          id={`${props.field.id}.school.id`}
          label={formatMessage(school.selection.schoolLabel)}
          backgroundColor="blue"
          required
          options={(schoolOptions || []).map((school) => {
            return {
              label: school.name,
              value: school.id,
            }
          })}
          onSelect={(value) => selectSchool(value)}
        />
      </Box>

      <Box marginTop={2}>
        <Controller
          name={`${props.field.id}.firstProgram.id`}
          render={({ field: { onChange } }) => {
            return (
              <Select
                name={`${props.field.id}.firstProgram.id`}
                label={formatMessage(school.selection.firstProgramLabel)}
                backgroundColor="blue"
                required
                isLoading={isLoadingPrograms}
                isDisabled={isLoadingPrograms}
                value={selectedFirstProgram}
                options={programOptions.map((program) => {
                  return {
                    label: getTranslatedProgram(lang, program),
                    value: program.id,
                  }
                })}
                onChange={(option: Option | null) => {
                  onChange(option?.value)
                  setSelectedFirstProgram(option)
                  setValueProgram('firstProgram', option?.value)
                }}
              />
            )
          }}
        />
      </Box>

      {isFreshman && (
        <Box marginTop={2}>
          <Controller
            name={`${props.field.id}.secondProgram.id`}
            render={({ field: { onChange } }) => {
              return (
                <Select
                  name={`${props.field.id}.secondProgram.id`}
                  label={formatMessage(school.selection.secondProgramLabel)}
                  backgroundColor="blue"
                  required={true}
                  isLoading={isLoadingPrograms}
                  isDisabled={isLoadingPrograms}
                  value={selectedSecondProgram}
                  options={programOptions.map((program) => {
                    return {
                      label: getTranslatedProgram(lang, program),
                      value: program.id,
                    }
                  })}
                  onChange={(option: Option | null) => {
                    onChange(option?.value)
                    setSelectedSecondProgram(option)
                    setValueProgram('secondProgram', option?.value)
                  }}
                />
              )
            }}
          />
        </Box>
      )}

      <Box marginTop={2}>
        <Controller
          name={`${props.field.id}.thirdLanguage.code`}
          render={({ field: { onChange } }) => {
            return (
              <Select
                name={`${props.field.id}.thirdLanguage.code`}
                label={formatMessage(school.selection.thirdLanguageLabel)}
                backgroundColor="blue"
                isClearable
                isLoading={isLoadingPrograms}
                isDisabled={isLoadingPrograms}
                value={selectedThirdLanguage}
                options={thirdLanguageOptions.map((language) => {
                  return {
                    label: language.name,
                    value: language.code,
                  }
                })}
                onChange={(option: Option | null) => {
                  onChange(option?.value)
                  setSelectedThirdLanguage(option)
                  setValueThirdLanguage(option?.value)
                }}
              />
            )
          }}
        />
      </Box>

      <Box marginTop={2}>
        <Controller
          name={`${props.field.id}.nordicLanguage.code`}
          render={({ field: { onChange } }) => {
            return (
              <Select
                name={`${props.field.id}.nordicLanguage.code`}
                label={formatMessage(school.selection.nordicLanguageLabel)}
                backgroundColor="blue"
                isClearable
                isLoading={isLoadingPrograms}
                isDisabled={isLoadingPrograms}
                value={selectedNordicLanguage}
                options={nordicLanguageOptions.map((language) => {
                  return {
                    label: language.name,
                    value: language.code,
                  }
                })}
                onChange={(option: Option | null) => {
                  onChange(option?.value)
                  setSelectedNordicLanguage(option)
                  setValueNordicLanguage(option?.value)
                }}
              />
            )
          }}
        />
      </Box>

      {!!selectedNordicLanguage && (
        <Box marginTop={2}>
          <AlertMessage
            type="info"
            message={formatMessage(school.selection.nordicLanguageAlertMessage)}
          />
        </Box>
      )}

      <Box marginTop={2}>
        <CheckboxController
          id={`${props.field.id}.requestDormitory`}
          backgroundColor="blue"
          large
          spacing={2}
          options={[
            {
              label: formatMessage(
                school.selection.requestDormitoryCheckboxLabel,
              ),
              value: YES,
            },
          ]}
        />
      </Box>
    </Box>
  )
}
