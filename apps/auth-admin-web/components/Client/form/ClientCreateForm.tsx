import React, { useEffect, useState } from 'react'
import ClientDTO from '../../../entities/dtos/client-dto'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { ClientService } from '../../../services/ClientService'
import { Client } from './../../../entities/models/client.model'
import { ClientTypeInfoService } from './../../../services/ClientTypeInfoService'
import { TimeUtils } from './../../../utils/time.utils'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationCreateFormDropdown from '../../Admin/form/TranslationCreateFormDropdown'
interface Props {
  client: ClientDTO
  onNextButtonClick?: (client: ClientDTO) => void
  handleCancel?: () => void
}

interface FormOutput {
  client: ClientDTO
  baseUrl: string
}

const ClientCreateForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<FormOutput>()
  const { isSubmitting } = formState
  const [show, setShow] = useState(false)
  const [available, setAvailable] = useState<boolean>(false)
  const [clientIdLength, setClientIdLength] = useState<number>(0)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [clientTypeSelected, setClientTypeSelected] = useState<boolean>(false)
  const [clientTypeInfo, setClientTypeInfo] = useState<JSX.Element>(<div></div>)
  const [client, setClient] = useState<ClientDTO>(props.client)
  const [requireConsent, setRequireConsent] = useState(false)
  const [callbackUri, setCallbackUri] = useState('')
  const [showClientTypeInfo, setShowClientTypeInfo] = useState<boolean>(false)
  const [showBaseUrlInfo, setShowBaseUrlInfo] = useState<boolean>(false)

  const castToNumbers = (obj: ClientDTO): ClientDTO => {
    obj.absoluteRefreshTokenLifetime = +obj.absoluteRefreshTokenLifetime
    obj.accessTokenLifetime = +obj.accessTokenLifetime
    obj.authorizationCodeLifetime = +obj.authorizationCodeLifetime
    obj.deviceCodeLifetime = +obj.deviceCodeLifetime
    obj.refreshTokenExpiration = +obj.refreshTokenExpiration
    obj.refreshTokenUsage = +obj.refreshTokenUsage
    obj.slidingRefreshTokenLifetime = +obj.slidingRefreshTokenLifetime
    obj.identityTokenLifetime = +obj.identityTokenLifetime
    obj.accessTokenType = +obj.accessTokenType

    if (!obj.consentLifetime) {
      obj.consentLifetime = null
    } else {
      obj.consentLifetime = +obj.consentLifetime
    }

    if (!obj.userSsoLifetime) {
      obj.userSsoLifetime = null
    } else {
      obj.userSsoLifetime = +obj.userSsoLifetime
    }

    return obj
  }

  const hideClientInfo = async () => {
    await TimeUtils.delay(1000)
    setShowClientTypeInfo(false)
  }

  useEffect(() => {
    if (props.client && props.client.clientId) {
      setIsEditing(true)
      setAvailable(true)
      setClientTypeSelected(true)
      setClientType(props.client.clientType)
      if (props.client.requireConsent) {
        setRequireConsent(true)
      } else {
        setRequireConsent(false)
      }
    } else {
      setClientTypeInfo(getClientTypeHTML(''))
    }
    setClient({ ...props.client })
  }, [props.client])

  const create = async (data: ClientDTO): Promise<Client | null> => {
    const response = await ClientService.create(data)
    if (response) {
      if (props.onNextButtonClick) {
        props.onNextButtonClick(data)
      }
      return response
    }
    return null
  }

  const edit = async (data: ClientDTO) => {
    // We delete the client id in the service. That's why we do a deep copy
    const handleObject = { ...data }
    const response = await ClientService.update(data, props.client.clientId)

    if (response) {
      if (props.onNextButtonClick) {
        props.onNextButtonClick(handleObject)
      }
    }
  }

  const save = async (data: FormOutput) => {
    const clientObject = castToNumbers(data.client)
    if (!isEditing) {
      const savedClient = await create(clientObject)
      if (savedClient) {
        ClientService.setDefaults(savedClient, data.baseUrl)
      }
    } else {
      edit(clientObject)
    }
  }

  const checkAvailability = async (clientId: string) => {
    setClientIdLength(clientId.length)
    if (!clientId) {
      return
    }

    const response = await ClientService.findClientById(clientId)
    if (response) {
      setAvailable(false)
    } else {
      setAvailable(true)
    }
  }

  const getClientTypeHTML = (clientType): JSX.Element => {
    const clientInfo = ClientTypeInfoService.getClientTypeInfo(clientType)

    return (
      <div className="detail-container">
        <div className="detail-title">{clientInfo.title}</div>
        <div className={`detail-flow${clientInfo.flow ? ' show' : ' hidden'}`}>
          {clientInfo.flow}
        </div>
        <div className="detail-description">{clientInfo.description}</div>
        <div className="detail-link">
          <a href={clientInfo.url} target="_blank" rel="noreferrer">
            {clientInfo.urlText}
          </a>
        </div>
      </div>
    )
  }

  const setClientType = async (clientType: string) => {
    if (clientType) {
      if (clientType === 'spa') {
        client.requireClientSecret = false
        client.requirePkce = true

        setClientTypeInfo(getClientTypeHTML('spa'))
      }

      if (clientType === 'native') {
        client.requireClientSecret = false
        client.requirePkce = true

        setClientTypeInfo(getClientTypeHTML('native'))
      }

      if (clientType === 'web') {
        client.requireClientSecret = true
        client.requirePkce = false

        setClientTypeInfo(getClientTypeHTML('web'))
      }

      if (clientType === 'machine') {
        client.requireClientSecret = true
        client.requirePkce = false

        setClientTypeInfo(getClientTypeHTML('machine'))
      }

      setClientTypeSelected(true)
    } else {
      setClientTypeInfo(getClientTypeHTML(''))
      setClientTypeSelected(false)
    }
  }

  return (
    <div className="client">
      <div className="client__wrapper">
        <div className="client__container">
          <h1>{isEditing ? 'Edit Client' : 'Create a new Client'}</h1>
          <div className="client__container__form">
            <div className="client__help">
              Enter some basic details for this client. Click{' '}
              <a href="#advanced">advanced</a> to configure preferences if
              default settings need to be changed. You will then go through
              steps to configure and add additional properties.
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="client__container__fields">
                <div className={clientTypeSelected ? '' : 'field-with-details'}>
                  <div className="client__container__field">
                    <label className="client__label">Client Type</label>
                    <select
                      name="client.clientType"
                      ref={register({ required: true })}
                      title="Type of Client"
                      onChange={(e) => setClientType(e.target.value)}
                      onFocus={() => setShowClientTypeInfo(true)}
                      onBlur={hideClientInfo}
                    >
                      <option value="" selected={!client.clientType}>
                        Select Client Type
                      </option>
                      <option
                        value="spa"
                        selected={client.clientType === 'spa'}
                      >
                        Single Page App
                      </option>
                      <option
                        value="native"
                        selected={client.clientType === 'native'}
                      >
                        Native
                      </option>
                      <option
                        value="web"
                        selected={client.clientType === 'web'}
                      >
                        Web App
                      </option>
                      <option
                        value="machine"
                        selected={client.clientType === 'machine'}
                      >
                        Machine
                      </option>
                      <option
                        value="device"
                        selected={client.clientType === 'device'}
                        disabled
                      >
                        Device (not supported)
                      </option>
                    </select>

                    <HelpBox helpText="Select the appropriate Client Type" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientType"
                      message="Client Type is required"
                    />
                    <div
                      className={`client__container__field__details${
                        showClientTypeInfo ? ' show' : ' hidden'
                      }`}
                    >
                      {clientTypeInfo}
                    </div>
                  </div>
                </div>

                <div className={clientTypeSelected ? '' : 'hidden'}>
                  <div className="client__container__field">
                    <label className="client__label">
                      National Id (Kennitala)
                    </label>
                    <input
                      type="text"
                      name="client.nationalId"
                      ref={register({
                        required: true,
                        maxLength: 10,
                        minLength: 10,
                        validate: ValidationUtils.validateNationalId,
                      })}
                      defaultValue={client.nationalId}
                      className="client__input"
                      placeholder="0123456789"
                      maxLength={10}
                      title="The nationalId (Kennitala) registered for the client"
                    />
                    <HelpBox helpText="The nationalId (Kennitala) registered for the client" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.nationalId"
                      message="NationalId must be 10 numeric characters"
                    />
                  </div>
                  <div className="client__container__field">
                    <label className="client__label">Contact email</label>
                    <input
                      type="text"
                      ref={register({
                        required: true,
                        validate: ValidationUtils.validateEmail,
                      })}
                      name="client.contactEmail"
                      defaultValue={client.contactEmail ?? ''}
                      className="client__input"
                      title="The email of the person who can be contacted regarding this Client"
                      placeholder="john@example.com"
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.contactEmail"
                      message="Contact email must be set and must be a valid email address"
                    />
                    <HelpBox helpText="The email of the person who can be contacted regarding this Client" />
                  </div>
                  <div className="client__container__field">
                    <label className="client__label">Client Id</label>
                    <input
                      type="text"
                      name="client.clientId"
                      ref={register({
                        required: true,
                        validate: ValidationUtils.validateIdentifier,
                      })}
                      defaultValue={client.clientId}
                      className="client__input"
                      placeholder="example-client"
                      onChange={(e) => checkAvailability(e.target.value)}
                      title="The unique identifier for this application"
                      readOnly={isEditing}
                    />
                    <div
                      className={`client__container__field__available ${
                        available ? 'ok ' : 'taken '
                      } ${clientIdLength > 0 ? 'show' : 'hidden'}`}
                    >
                      {available ? 'Available' : 'Unavailable'}
                    </div>
                    <HelpBox helpText="The unique identifier for this application. No spaces or special characters." />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientId"
                      message="Client Id is required and needs to be in the right format (no spaces or special characters)"
                    />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">Description</label>
                    <input
                      type="text"
                      ref={register({
                        validate: ValidationUtils.validateDescription,
                      })}
                      name="client.description"
                      defaultValue={client.description ?? ''}
                      className="client__input"
                      title="Application description for use within AdminUI"
                      placeholder="Example description"
                    />
                    <HelpBox helpText="Application description for use within the IDS management" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.description"
                      message="Description can not include special characters"
                    />
                  </div>

                  <div>
                    <div className="client__container__field">
                      <label className="client__label">Base Url:</label>
                      <input
                        readOnly={isEditing}
                        name="baseUrl"
                        type="text"
                        ref={register({
                          required: !isEditing,
                          validate: ValidationUtils.validateUrl,
                        })}
                        defaultValue={client.clientUri ?? ''}
                        className="client__input"
                        placeholder="https://localhost:4200"
                        title="Base Url of the application. Used for Cors Origin and callback URI. The callback uri will be the specified Base Url /signin-oidc"
                        onChange={(e) => setCallbackUri(e.target.value)}
                        onFocus={() => setShowBaseUrlInfo(true)}
                        onBlur={() => setShowBaseUrlInfo(false)}
                      />
                      <HelpBox helpText="Base Url of the application. Used for adding Cors Origin, Redirect (callback) URI and Post Logout URI. The Redirect (callback) URI will be the specified Base Url /signin-oidc" />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="baseUrl"
                        message="Base Url is required and needs to be in the right format"
                      />
                      <div
                        className={`client__container__field__details
                          ${showBaseUrlInfo ? ' show' : ' hidden'}`}
                      >
                        <div className="detail-title">
                          Redirect (Callback) Uri will be:
                        </div>
                        <div className="detail-uri">
                          {callbackUri}/signin-oidc
                        </div>
                        <div className="detail-link">
                          This can be changed later
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">Display Name</label>
                    <input
                      type="text"
                      name="client.clientName"
                      ref={register({
                        validate: ValidationUtils.validateDescription,
                      })}
                      defaultValue={client.clientName ?? ''}
                      className="client__input"
                      title="Application name that will be seen on consent screens"
                      placeholder="Example name"
                    />
                    <HelpBox helpText="Application name that will be seen on consent screens" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientName"
                      message="Display name is required since the client requires consent"
                    />
                    <TranslationCreateFormDropdown
                      className="client"
                      property="clientName"
                      isEditing={isEditing}
                      id={client.clientId}
                    />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">Display URL</label>
                    <input
                      name="client.clientUri"
                      ref={register({ validate: ValidationUtils.validateUrl })}
                      type="text"
                      defaultValue={client.clientUri ?? ''}
                      className="client__input"
                      placeholder="https://example.com"
                      title="Application URL that will be seen on consent screens"
                    />
                    <HelpBox helpText="URI to further information about client (used on consent screen)" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientUri"
                      message="Display url needs to be in the right format"
                    />
                  </div>

                  <div className="client__container__checkbox__field">
                    <label className="client__label">Enabled</label>
                    <input
                      type="checkbox"
                      name="client.enabled"
                      className="client__checkbox"
                      defaultChecked={client.enabled}
                      ref={register}
                    ></input>
                    <HelpBox helpText="Sets client enabled or disabled" />
                  </div>

                  <div className="client__container__checkbox__field">
                    <label className="client__label">Require consent</label>
                    <input
                      type="checkbox"
                      defaultChecked={client.requireConsent}
                      className="client__input"
                      name="client.requireConsent"
                      ref={register}
                      title="Specifies whether a consent screen is required"
                      onChange={(e) => setRequireConsent(e.target.checked)}
                    />
                    <HelpBox helpText="Specifies whether a consent screen is required" />
                  </div>

                  <div className="client__container__button" id="advanced">
                    <button
                      type="button"
                      className="client__button__show"
                      onClick={() => setShow(!show)}
                    >
                      <i className="client__button__show__icon"></i>
                      Advanced
                    </button>
                  </div>

                  <div
                    className={`client__container__advanced ${
                      show === true ? 'show' : 'hidden'
                    }`}
                  >
                    <section className="client_section">
                      <h3>Delegation section</h3>

                      <div className="client__container__checkbox__field">
                        <label
                          className="client__label"
                          htmlFor="supportsDelegation"
                        >
                          Supports Delegation
                        </label>
                        <input
                          id="supportsDelegation"
                          type="checkbox"
                          name="client.supportsDelegation"
                          defaultChecked={client.supportsDelegation}
                          className="client__input"
                          ref={register}
                          title="Specifies if the client supports delegation"
                        />
                        <HelpBox helpText="Specifies if the client supports delegation" />
                      </div>

                      <div className="client__container__checkbox__field">
                        <label
                          className="client__label"
                          htmlFor="supportsLegalGuardians"
                        >
                          Supports Legal Guardians Delegation
                        </label>
                        <input
                          id="supportsLegalGuardians"
                          type="checkbox"
                          name="client.supportsLegalGuardians"
                          defaultChecked={client.supportsLegalGuardians}
                          className="client__input"
                          ref={register}
                          title="Specifies if the client supports legal guardian delegation"
                        />
                        <HelpBox helpText="Specifies if the client supports legal guardian delegation" />
                      </div>

                      <div className="client__container__checkbox__field">
                        <label
                          className="client__label"
                          htmlFor="supportsProcuringHolders"
                        >
                          Supports Procuring Holders Delegation
                        </label>
                        <input
                          id="supportsProcuringHolders"
                          type="checkbox"
                          name="client.supportsProcuringHolders"
                          defaultChecked={client.supportsProcuringHolders}
                          className="client__input"
                          ref={register}
                          title="Specifies if the client supports Procuring Holders delegation"
                        />
                        <HelpBox helpText="Specifies if the client supports Procuring Holders delegation" />
                      </div>

                      <div className="client__container__checkbox__field">
                        <label
                          className="client__label"
                          htmlFor="promptDelegations"
                        >
                          Prompt delegations
                        </label>
                        <input
                          id="promptDelegations"
                          type="checkbox"
                          name="client.promptDelegations"
                          defaultChecked={client.promptDelegations}
                          className="client__input"
                          ref={register}
                          title="Specifies if the user is prompt with delegation window"
                        />
                        <HelpBox helpText="Specifies if the user is prompt with delegation window" />
                      </div>
                    </section>

                    <div className="client__container__field">
                      <label className="client__label">
                        Front channel logout uri
                      </label>
                      <input
                        type="text"
                        name="client.frontChannelLogoutUri"
                        defaultValue={client.frontChannelLogoutUri ?? ''}
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox
                        helpText="Specifies logout URI at client for HTTP based front-channel logout."
                        helpLinkText="See the OIDC Connect Session Management spec for more details."
                        helpLink="https://openid.net/specs/openid-connect-session-1_0.html"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Rair wise subject salt
                      </label>
                      <input
                        type="text"
                        defaultValue={client.pairWiseSubjectSalt ?? ''}
                        className="client__input"
                        name="client.pairWiseSubjectSalt"
                        ref={register}
                      />
                      <HelpBox helpText="Salt value used in pair-wise subjectId generation for users of this client." />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">User code type</label>
                      <input
                        type="text"
                        defaultValue={client.userCodeType ?? ''}
                        name="client.userCodeType"
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox helpText="Specifies the type of user code to use for the client. Otherwise falls back to default" />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">Access Token Type</label>
                      <select
                        name="client.accessTokenType"
                        className="client__select"
                        ref={register({ required: true })}
                      >
                        <option
                          value={0}
                          selected={client.accessTokenType === 0}
                        >
                          JWT
                        </option>
                        <option
                          value={1}
                          selected={client.accessTokenType === 1}
                        >
                          Reference
                        </option>
                      </select>
                      <HelpBox helpText="Specifies whether the access token is a reference token or a self contained JWT token (defaults to Jwt)." />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.accessTokenType"
                        message="Access Token Type is required"
                      />
                    </div>

                    {/* Number inputs */}
                    <div className="client__container__field">
                      <label className="client__label">
                        Access Token Lifetime
                      </label>

                      <input
                        ref={register({ required: true, min: 0 })}
                        type="number"
                        name="client.accessTokenLifetime"
                        defaultValue={client.accessTokenLifetime}
                        className="client__input"
                      />
                      <HelpBox helpText="Lifetime of access token in seconds (defaults to 3600 seconds / 1 hour)" />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.accessTokenLifetime"
                        message="Access Token Lifetime is required"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Authorization code lifetime
                      </label>
                      <input
                        type="number"
                        name="client.authorizationCodeLifetime"
                        defaultValue={client.authorizationCodeLifetime}
                        ref={register({ required: true, min: 0 })}
                        className="client__input"
                      />
                      <HelpBox helpText="Lifetime of authorization code in seconds (defaults to 300 seconds / 5 minutes)" />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.authorizationCodeLifetime"
                        message="Authorization code lifetime is required"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">Consent lifetime</label>
                      <input
                        type="number"
                        name="client.consentLifetime"
                        defaultValue={client.consentLifetime ?? ''}
                        className="client__input"
                        ref={register({ min: 0 })}
                      />
                      <HelpBox helpText="Lifetime of a user consent in seconds. Defaults to null (no expiration)." />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.consentLifetime"
                        message="Value can not be negative"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Device code lifetime
                      </label>
                      <input
                        type="number"
                        ref={register({ required: true, min: 0 })}
                        name="client.deviceCodeLifetime"
                        defaultValue={client.deviceCodeLifetime}
                        className="client__input"
                      />
                      <HelpBox helpText="Lifetime to device code in seconds (defaults to 300 seconds / 5 minutes)" />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.deviceCodeLifetime"
                        message="Device code lifetime is required"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">User Sso Lifetime</label>
                      <input
                        type="number"
                        defaultValue={client.userSsoLifetime ?? ''}
                        name="client.userSsoLifetime"
                        className="client__input"
                        ref={register({ min: 0 })}
                      />
                      <HelpBox helpText="The maximum duration (in seconds) since the last time the user authenticated. (Default null)" />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.userSsoLifetime"
                        message="Value can not be negative"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Refresh Token Usage
                      </label>
                      <select
                        name="client.refreshTokenUsage"
                        className="client__select"
                        ref={register({ required: true })}
                      >
                        <option
                          value={0}
                          selected={client.refreshTokenUsage === 0}
                        >
                          ReUse
                        </option>
                        <option
                          value={1}
                          selected={client.refreshTokenUsage === 1}
                        >
                          OneTime
                        </option>
                      </select>
                      <HelpBox
                        helpText='"ReUse" the refresh token handle will stay the same when refreshing tokens. 
                    "OneTime" the refresh token handle will be updated when refreshing tokens. This is the default'
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Refresh token expiration
                      </label>
                      <select
                        name="client.refreshTokenExpiration"
                        className="client__select"
                        ref={register({ required: true })}
                      >
                        <option
                          value={0}
                          selected={client.refreshTokenExpiration === 0}
                        >
                          Sliding
                        </option>
                        <option
                          value={1}
                          selected={client.refreshTokenExpiration === 1}
                        >
                          Absolute
                        </option>
                      </select>
                      <HelpBox
                        helpText="Absolute the refresh token will expire on a fixed point in time (specified by the AbsoluteRefreshTokenLifetime)

Sliding when refreshing the token, the lifetime of the refresh token will be renewed (by the amount specified in SlidingRefreshTokenLifetime). The lifetime will not exceed AbsoluteRefreshTokenLifetime."
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Sliding refresh token lifetime
                      </label>
                      <input
                        type="number"
                        defaultValue={client.slidingRefreshTokenLifetime}
                        name="client.slidingRefreshTokenLifetime"
                        className="client__input"
                        ref={register({ min: 0 })}
                      />
                      <HelpBox helpText="Sliding lifetime of a refresh token in seconds. Defaults to 1296000 seconds / 15 days" />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.slidingRefreshTokenLifetime"
                        message="Value can not be negative"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Absolute Refresh Token Lifetime
                      </label>
                      <input
                        type="number"
                        ref={register({ required: true, min: 0 })}
                        name="client.absoluteRefreshTokenLifetime"
                        defaultValue={client.absoluteRefreshTokenLifetime}
                        className="client__input"
                      />
                      <HelpBox helpText="Maximum lifetime of a refresh token in seconds. Defaults to 2592000 seconds / 30 days" />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.absoluteRefreshTokenLifetime"
                        message="Absolute Refresh Token Lifetime is required"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Identity token lifetime
                      </label>
                      <input
                        type="number"
                        name="client.identityTokenLifetime"
                        defaultValue={client.identityTokenLifetime}
                        ref={register({ required: true, min: 0 })}
                        className="client__input"
                      />
                      <HelpBox helpText="Lifetime to identity token in seconds (defaults to 300 seconds / 5 minutes)" />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.identityTokenLifetime"
                        message="Key is required"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">Protocol Type</label>
                      <input
                        ref={register({ required: true, min: 0 })}
                        type="text"
                        name="client.protocolType"
                        defaultValue={
                          client.protocolType ? client.protocolType : 'oidc'
                        }
                        className="client__input"
                      />
                      <HelpBox helpText="Typically set to oidc" />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.protocolType"
                        message="Protocol Type is required"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Client claims prefix
                      </label>
                      <input
                        ref={register}
                        type="text"
                        name="client.clientClaimsPrefix"
                        defaultValue={
                          client.clientClaimsPrefix
                            ? client.clientClaimsPrefix
                            : 'client__'
                        }
                        className="client__input"
                      />
                      <HelpBox helpText="If set, the prefix client claim types will be prefixed with. Defaults to client_. The intent is to make sure they don’t accidentally collide with user claims." />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="client.clientClaimsPrefix"
                        message="Client claims prefix is required"
                      />
                    </div>

                    {/* Checkboxes */}
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        Allow access Token Via Browser
                      </label>
                      <input
                        type="checkbox"
                        name="client.allowAccessTokenViaBrowser"
                        defaultChecked={client.allowAccessTokenViaBrowser}
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox helpText="Specifies whether this client is allowed to receive access tokens via the browser. This is useful to harden flows that allow multiple response types (e.g. by disallowing a hybrid flow client that is supposed to use code id_token to add the token response type and thus leaking the token to the browser." />
                    </div>
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        Allow offline access
                      </label>
                      <input
                        name="client.allowOfflineAccess"
                        type="checkbox"
                        defaultChecked={client.allowOfflineAccess}
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox helpText="Specifies whether this client can request refresh tokens (be requesting the offline_access scope)" />
                    </div>
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        Allow plain text Pkce
                      </label>
                      <input
                        name="client.allowPlainTextPkce"
                        type="checkbox"
                        defaultChecked={client.allowPlainTextPkce}
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox helpText="Specifies whether clients using PKCE can use a plain text code challenge (not recommended)" />
                    </div>
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        Allow remember consent
                      </label>
                      <input
                        name="client.allowRememberConsent"
                        type="checkbox"
                        defaultChecked={client.allowRememberConsent}
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox helpText="Specifies whether user can choose to store consent decisions." />
                    </div>
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        Always include user claims in Id token
                      </label>
                      <input
                        type="checkbox"
                        name="client.alwaysIncludeUserClaimsInIdToken"
                        defaultChecked={client.alwaysIncludeUserClaimsInIdToken}
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox helpText="When requesting both an id token and access token, should the user claims always be added to the id token instead of requring the client to use the userinfo endpoint. Default is false." />
                    </div>
                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        Always send client claims
                      </label>
                      <input
                        type="checkbox"
                        name="client.alwaysSendClientClaims"
                        defaultChecked={client.alwaysSendClientClaims}
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox helpText="If set, the client claims will be sent for every flow. If not, only for client credentials flow (default is false)" />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        Back channel logout session required
                      </label>
                      <input
                        type="checkbox"
                        name="client.backChannelLogoutSessionRequired"
                        defaultChecked={client.backChannelLogoutSessionRequired}
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox helpText="Specifies if the user’s session id should be sent in the request to the BackChannelLogoutUri" />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        Enable local login
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={client.enableLocalLogin}
                        className="client__input"
                        name="client.enableLocalLogin"
                        ref={register}
                      />
                      <HelpBox helpText="Specifies if this client can use local accounts, or external IdPs only" />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        Front channel logout session required
                      </label>
                      <input
                        type="checkbox"
                        name="client.frontChannelLogoutSessionRequired"
                        defaultChecked={
                          client.frontChannelLogoutSessionRequired
                        }
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox helpText="Specifies if the user’s session id should be sent to the FrontChannelLogoutUri" />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">Include Jwt Id</label>
                      <input
                        type="checkbox"
                        defaultChecked={client.includeJwtId}
                        className="client__input"
                        name="client.includeJwtId"
                        ref={register}
                      />
                      <HelpBox helpText="Specifies whether JWT access tokens should have an embedded unique ID (via the jti claim)" />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        Require Client Secret
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={client.requireClientSecret}
                        className="client__input"
                        name="client.requireClientSecret"
                        ref={register}
                      />
                      <HelpBox helpText="Specifies whether this client needs a secret to request tokens from the token endpoint" />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">Require Pkce</label>
                      <input
                        type="checkbox"
                        defaultChecked={client.requirePkce}
                        name="client.requirePkce"
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox helpText="Specifies whether clients using an authorization code based grant type must send a proof key" />
                    </div>

                    <div className="client__container__checkbox__field">
                      <label className="client__label">
                        Update access token claims on refresh
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={client.updateAccessTokenClaimsOnRefresh}
                        name="client.updateAccessTokenClaimsOnRefresh"
                        className="client__input"
                        ref={register}
                      />
                      <HelpBox helpText="Gets or sets a value indicating whether the access token (and its claims) should be updated on a refresh token request." />
                    </div>
                  </div>
                </div>
              </div>
              <div className="client__buttons__container">
                <div className="client__button__container">
                  <button
                    className="client__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                  >
                    Cancel
                  </button>
                </div>
                <div className="client__button__container">
                  <input
                    type="submit"
                    className="client__button__save"
                    disabled={isSubmitting || !available}
                    value="Next"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ClientCreateForm
