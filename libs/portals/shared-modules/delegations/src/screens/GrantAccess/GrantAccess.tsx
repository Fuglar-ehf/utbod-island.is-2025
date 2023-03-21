import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { Control, FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import * as kennitala from 'kennitala'

import {
  Box,
  Input,
  Icon,
  toast,
  Text,
  SkeletonLoader,
  useBreakpoint,
} from '@island.is/island-ui/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { IntroHeader } from '@island.is/portals/core'
import { formatNationalId, m as coreMessages } from '@island.is/portals/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserInfo } from '@island.is/auth/react'

import { DelegationsFormFooter } from '../../components/delegations/DelegationsFormFooter'
import { IdentityCard } from '../../components/IdentityCard/IdentityCard'
import { DomainOption, useDomains } from '../../hooks/useDomains/useDomains'
import { ALL_DOMAINS } from '../../constants/domain'
import { DelegationPaths } from '../../lib/paths'
import { m } from '../../lib/messages'
import {
  useCreateAuthDelegationMutation,
  useIdentityLazyQuery,
} from './GrantAccess.generated'
import * as styles from './GrantAccess.css'

const GrantAccess = () => {
  useNamespaces(['sp.access-control-delegations'])
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const [name, setName] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { md } = useBreakpoint()
  const {
    options,
    selectedOption,
    loading: domainLoading,
    updateDomain,
  } = useDomains(false)

  const [
    createAuthDelegation,
    { loading: mutationLoading },
  ] = useCreateAuthDelegationMutation()

  const noUserFoundToast = () => {
    toast.error(formatMessage(m.grantIdentityError))
  }

  const [getIdentity, { data, loading: queryLoading }] = useIdentityLazyQuery({
    onError: noUserFoundToast,
    onCompleted: (data) => {
      if (!data.identity) {
        noUserFoundToast()
      }
    },
  })

  const { identity } = data || {}

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      toNationalId: '',
      domainName: selectedOption?.value ?? null,
    },
  })
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = methods

  useEffect(() => {
    reset({ domainName: selectedOption?.value ?? null })
  }, [selectedOption?.value, reset])

  const watchToNationalId = watch('toNationalId')
  const domainNameWatcher = watch('domainName')
  const loading = queryLoading || mutationLoading

  const requestDelegation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value.replace('-', '').trim()
    if (value.length === 10 && kennitala.isValid(value)) {
      if (kennitala.isCompany(value)) {
        setName(value)
      } else {
        getIdentity({ variables: { input: { nationalId: value } } })
      }
    } else {
      setName('')
    }
  }

  useEffect(() => {
    if (identity && identity.nationalId === watchToNationalId) {
      setName(identity.name)
    }
  }, [identity, setName, watchToNationalId])

  const onSubmit = handleSubmit(async ({ toNationalId, domainName }) => {
    try {
      const { data } = await createAuthDelegation({
        variables: {
          input: {
            toNationalId,
            domainName: domainName === ALL_DOMAINS ? null : domainName,
          },
        },
      })
      if (data) {
        navigate(
          `${DelegationPaths.Delegations}/${data.createAuthDelegation.id}`,
        )
      }
    } catch (error) {
      toast.error(formatMessage(m.grantCreateError))
    }
  })

  const clearPersonState = () => {
    setName('')
    reset({
      toNationalId: '',
    })

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  return (
    <>
      <IntroHeader
        title={formatMessage(m.grantTitle)}
        intro={defineMessage(m.grantIntro)}
        marginBottom={4}
      />
      <div className={styles.container}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Box display="flex" flexDirection="column" rowGap={[5, 6]}>
              <IdentityCard
                label={formatMessage(m.accessOwner)}
                title={userInfo.profile.name}
                description={formatNationalId(userInfo.profile.nationalId)}
                color="blue"
              />
              <div className={styles.inputWrapper}>
                {name && (
                  <Input
                    name="name"
                    defaultValue={name}
                    aria-live="assertive"
                    label={formatMessage(m.grantFormAccessHolder)}
                    backgroundColor="blue"
                    size="md"
                  />
                )}
                <Box display={name ? 'none' : 'block'} aria-live="assertive">
                  <InputController
                    control={(control as unknown) as Control}
                    id="toNationalId"
                    icon={name || queryLoading ? undefined : 'search'}
                    ref={inputRef}
                    rules={{
                      required: {
                        value: true,
                        message: formatMessage(m.grantRequiredSsn),
                      },
                      validate: {
                        value: (value: number) => {
                          if (
                            value.toString().length === 10 &&
                            !kennitala.isValid(value)
                          ) {
                            return formatMessage(m.grantInvalidSsn)
                          }
                        },
                      },
                    }}
                    type="tel"
                    format="######-####"
                    label={formatMessage(m.grantFormAccessHolder)}
                    placeholder={'000000-0000'}
                    error={errors.toNationalId?.message}
                    onChange={(value) => {
                      requestDelegation(value)
                    }}
                    size="md"
                  />
                </Box>
                {queryLoading ? (
                  <span
                    className={cn(styles.icon, styles.loadingIcon)}
                    aria-label="Loading"
                  >
                    <Icon icon="reload" size="large" color="blue400" />
                  </span>
                ) : name ? (
                  <button
                    disabled={loading}
                    onClick={clearPersonState}
                    className={styles.icon}
                    aria-label={formatMessage(coreMessages.clearSelected)}
                  >
                    <Icon icon="close" size="large" color="blue400" />
                  </button>
                ) : null}
              </div>
              <div>
                {domainLoading ? (
                  <SkeletonLoader height={md ? 77 : 72} />
                ) : (
                  <SelectController
                    id="domainName"
                    name="domainName"
                    label={formatMessage(m.accessControl)}
                    placeholder={formatMessage(m.chooseDomain)}
                    error={errors.domainName?.message}
                    options={options}
                    onSelect={(option) => {
                      const opt = option as DomainOption

                      if (opt) {
                        updateDomain(opt)
                      }
                    }}
                    rules={{
                      required: {
                        value: true,
                        message: formatMessage(m.grantRequiredDomain),
                      },
                    }}
                  />
                )}
              </div>
            </Box>
            <Box display="flex" flexDirection="column" rowGap={5} marginTop={5}>
              <Text variant="small">
                {formatMessage(m.grantNextStepDescription)}
              </Text>
              <Box marginBottom={7}>
                <DelegationsFormFooter
                  disabled={!name || !domainNameWatcher}
                  loading={mutationLoading}
                  onCancel={() => navigate(DelegationPaths.Delegations)}
                  showShadow={false}
                  confirmLabel={formatMessage(m.grantChoosePermissions)}
                  confirmIcon="arrowForward"
                />
              </Box>
            </Box>
          </form>
        </FormProvider>
      </div>
    </>
  )
}

export default GrantAccess
