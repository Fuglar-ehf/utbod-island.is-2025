import React, { useState } from 'react'
import {
  Box,
  Divider,
  Input,
  Text,
  Checkbox,
  Button,
  toast,
  ToastContainer,
} from '@island.is/island-ui/core'

import * as styles from './Profile.css'

import * as headerStyles from '@island.is/financial-aid-web/veita/src/components/ApplicationHeader/ApplicationHeader.css'
import {
  InputType,
  isEmailValid,
  Staff,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'

import cn from 'classnames'
import { UpdateStaffMutation } from '@island.is/financial-aid-web/veita/graphql'
import { useMutation } from '@apollo/client'

interface EmployeeProfileProps {
  user: Staff
}

interface EmployeeProfileInfo {
  nationalId: string
  email?: string
  nickname?: string
  hasError: boolean
  roles: StaffRole[]
}

const EmployeeProfile = ({ user }: EmployeeProfileProps) => {
  const [state, setState] = useState<EmployeeProfileInfo>({
    nationalId: user.nationalId,
    nickname: user?.nickname ?? '',
    email: user.email ?? '',
    hasError: false,
    roles: user.roles,
  })

  const changeStaffAccess = (role: StaffRole, isAddingRole: boolean) => {
    isAddingRole
      ? setState({
          ...state,
          roles: [...state.roles, role],
          hasError: false,
        })
      : setState({
          ...state,
          roles: state.roles.filter((item) => item !== role),
        })
  }

  const inputFields = [
    {
      label: 'Kennitala',
      value: state.nationalId,
      type: 'number' as InputType,
      onchange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        if (event.currentTarget.value.length <= 10) {
          setState({
            ...state,
            nationalId: event.target.value,
            hasError: false,
          })
        }
      },
      error: !state.nationalId || state.nationalId.length !== 10,
    },
    {
      label: 'Netfang',
      value: state.email,
      bgIsBlue: true,
      type: 'email' as InputType,
      onchange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setState({ ...state, email: event.target.value, hasError: false })
      },
      error: !state.email || !isEmailValid(state.email),
    },
    {
      label: 'Stutt nafn',
      value: state.nickname,
      type: 'text' as InputType,
      onchange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setState({
          ...state,
          nickname: event.currentTarget.value,
          hasError: false,
        })
      },
    },
  ]

  const [updateStaff, { loading }] = useMutation(UpdateStaffMutation)

  const changeUserActivity = async (active: boolean) => {
    await updateStaff({
      variables: {
        input: {
          id: user.id,
          active,
        },
      },
    })
      .then(() => {
        toast.success('Það tókst að uppfæra notanda')
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að uppfæra notanda, vinsamlega reynið aftur síðar',
        )
      })
  }

  const areRequiredFieldsFilled =
    !state.email ||
    !state.nationalId ||
    state.roles.length === 0 ||
    !isEmailValid(state.email) ||
    state.nationalId.length !== 10

  const onSubmitUpdate = async () => {
    if (areRequiredFieldsFilled) {
      setState({ ...state, hasError: true })
      return
    }

    try {
      await updateStaff({
        variables: {
          input: {
            id: user.id,
            nationalId: state.nationalId,
            roles: state.roles,
            nickname: state.nickname,
            email: state.email,
          },
        },
      }).then(() => {
        toast.success('Það tókst að uppfæra notanda')
      })
    } catch (e) {
      toast.error(
        'Ekki tókst að uppfæra notanda, vinsamlega reynið aftur síðar',
      )
    }
  }

  return (
    <>
      <Box
        marginTop={15}
        marginBottom={15}
        className={`${styles.applicantWrapper} ${styles.widthAlmostFull}`}
      >
        <Box className={`${styles.widthAlmostFull}`}>
          <Box className={`contentUp delay-25`} marginBottom={[3, 3, 7]}>
            <Text as="h1" variant="h1" marginBottom={2}>
              {user.name}
            </Text>

            <Divider />

            <Box display="flex" marginRight={1} marginTop={5}>
              <Box marginRight={1}>
                <Text variant="small" fontWeight="semiBold" color="dark300">
                  Staða
                </Text>
              </Box>
              <Box marginRight={1}>
                <Text variant="small">
                  Notandi er {user.active ? 'virkur' : 'óvirkur'}
                </Text>
              </Box>
              <button
                onClick={() => changeUserActivity(!user.active)}
                disabled={loading}
                className={headerStyles.button}
              >
                {user.active ? 'Óvirkja' : 'Virkja'}
              </button>
            </Box>
          </Box>

          {inputFields.map((item, index) => {
            return (
              <Box
                className={`contentUp`}
                marginBottom={3}
                style={{ animationDelay: index * 10 + 30 + 'ms' }}
                key={`inputField-${index}`}
              >
                <Input
                  label={item.label}
                  name={`userInput-${index}`}
                  type={item.type}
                  value={item.value}
                  onChange={item.onchange}
                  backgroundColor={item.bgIsBlue ? 'blue' : 'white'}
                  hasError={state.hasError && item.error}
                />
              </Box>
            )
          })}

          <Box
            className={`contentUp delay-75`}
            marginTop={3}
            marginBottom={[3, 3, 5]}
          >
            {' '}
            <Text as="h2" variant="h3" color="dark300" marginBottom={3}>
              Réttindi notanda
            </Text>
            <Box marginBottom={3}>
              <Checkbox
                name={'employee'}
                label="Vinnsluaðili"
                checked={state.roles.includes(StaffRole.EMPLOYEE)}
                strong={false}
                hasError={state.hasError && state.roles.length === 0}
                onChange={(event) => {
                  changeStaffAccess(StaffRole.EMPLOYEE, event.target.checked)
                }}
              />
            </Box>
            <Box marginBottom={2}>
              <Checkbox
                name={'admin'}
                label="Stjórnandi (admin)"
                checked={state.roles.includes(StaffRole.ADMIN)}
                hasError={state.hasError && state.roles.length === 0}
                onChange={(event) => {
                  changeStaffAccess(StaffRole.ADMIN, event.target.checked)
                }}
                strong={false}
              />
            </Box>
            <div
              className={cn({
                [`errorMessage`]: true,
                [`showErrorMessage`]:
                  state.hasError && state.roles.length === 0,
              })}
            >
              <Text color="red600" fontWeight="semiBold" variant="small">
                Þú þarft að velja önnur hvor réttindin fyrir þennan notanda
              </Text>
            </div>
            <Text variant="small">
              Stjórnandi í Veitu hefur aðgang að stillingum sveitarfélagsins þar
              sem vefslóðir, netföng og upphæðir eru skilgreindar. Þessar
              stillingar hafa áhrif á Veitu, Ósk og Stöðusíðu auk þess sem þær
              koma einnig við sögu í sumum sjálfvirkum tölvupóstum til
              umsækjenda.
            </Text>
          </Box>
          <Box
            className={`contentUp delay-100`}
            marginTop={3}
            display="flex"
            justifyContent="flexEnd"
          >
            <Button loading={loading} icon="checkmark" onClick={onSubmitUpdate}>
              Vista stillingar
            </Button>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </>
  )
}

export default EmployeeProfile
