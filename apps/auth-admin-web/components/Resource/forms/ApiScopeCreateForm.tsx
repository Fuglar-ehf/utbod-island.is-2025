import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ApiScopeDTO } from '../../../entities/dtos/api-scope-dto'
import { ResourcesService } from '../../../services/ResourcesService'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationCreateFormDropdown from '../../Admin/form/TranslationCreateFormDropdown'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
import { ApiScopeGroup } from './../../../entities/models/api-scope-group.model'
import ApiScopeGroupCreateFormModal from './ApiScopeGroupCreateFormModal'
import { Domain } from './../../../entities/models/domain.model'
import { getDisplayName } from 'next/dist/next-server/lib/utils'

interface Props {
  handleSave?: (object: ApiScopeDTO) => void
  handleCancel?: () => void
  apiScope: ApiScopeDTO
}

interface FormOutput {
  apiScope: ApiScopeDTO
  groupName: string
  domain: string
}

const ApiScopeCreateForm: React.FC<Props> = (props) => {
  const { register, handleSubmit, errors, formState } = useForm<FormOutput>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [available, setAvailable] = useState<boolean>(false)
  const [groups, setGroups] = useState<ApiScopeGroup[]>([])
  const [nameLength, setNameLength] = useState(0)
  const [domains, setDomains] = useState<Domain[]>([])

  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ApiScopeCreateForm'),
  )

  useEffect(() => {
    async function getDomains() {
      const response = await ResourcesService.findAllDomains()
      if (response) {
        setDomains(response as Domain[])
      }
    }

    if (props.apiScope && props.apiScope.name) {
      setIsEditing(true)
      setAvailable(true)
    }
    getGroups()
    getDomains()
  }, [props.apiScope])

  const getGroups = async () => {
    const response = await ResourcesService.findAllApiScopeGroups()

    if (response) {
      setGroups([...(response as ApiScopeGroup[])])
    }
  }

  const checkAvailability = async (name: string) => {
    setNameLength(name.length)
    if (name.length === 0) {
      setAvailable(false)
      return
    }
    const response = await ResourcesService.isScopeNameAvailable(name)
    setAvailable(response)
  }

  const save = async (data: ApiScopeDTO) => {
    const response = isEditing
      ? await ResourcesService.updateApiScope(data)
      : await ResourcesService.createApiScope(data)
    if (response) {
      if (props.handleSave) {
        props.handleSave(data)
      }
    }
  }

  return (
    <div className="api-scope-form">
      <div className="api-scope-form__wrapper">
        <div className="api-scope-form__container">
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="api-scope-form__container__form">
            <div className="api-scope-form__help">{localization.help}</div>
            <form onSubmit={handleSubmit(save)}>
              <div className="api-scope-form__container__fields">
                <div className="api-scope-form__container__field">
                  <div className="api-scope-form__prefix-container">
                    <label htmlFor="domain" className="api-scope-form__label">
                      Domain
                    </label>
                    <select id="domain" name="domain" ref={register()}>
                      <option value={'null'} selected={!props.apiScope.name}>
                        {localization.fields['groupId'].selectAnItem}
                      </option>
                      {domains.map((domain: Domain) => {
                        return (
                          <option
                            value={domain.name + '/'}
                            key={domain.name}
                            selected={props?.apiScope?.name?.includes(
                              domain.name + '/',
                            )}
                            title={domain.description}
                          >
                            {domain.name + '/'}
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  <div className="api-scope-form__prefix-container">
                    <label
                      htmlFor="groupName"
                      className="api-scope-form__label"
                    >
                      Group
                    </label>
                    <select id="groupName" name="groupName" ref={register()}>
                      <option value={'null'} selected={!props.apiScope.name}>
                        {localization.fields['groupId'].selectAnItem}
                      </option>
                      {groups.map((group: ApiScopeGroup) => {
                        return (
                          <option
                            value={group.name + '/'}
                            key={group.id}
                            selected={props?.apiScope?.name?.includes(
                              group.name + '/',
                            )}
                            title={group.description}
                          >
                            {group.name + '/'}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <label htmlFor="domain" className="api-scope-form__label">
                    {localization.fields['name'].label}
                  </label>
                  <input
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateScope,
                    })}
                    id="name"
                    name="apiScope.name"
                    type="text"
                    className="api-scope-form__input"
                    defaultValue={props.apiScope.name}
                    readOnly={isEditing}
                    onChange={(e) => checkAvailability(e.target.value)}
                    placeholder={localization.fields['name'].placeholder}
                  />
                  <div
                    className={`api-scope-form__container__field__available ${
                      available ? 'ok ' : 'taken '
                    } ${nameLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {available
                      ? localization.fields['name'].available
                      : localization.fields['name'].unAvailable}
                  </div>
                  <HelpBox helpText={localization.fields['name'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="apiScope.name"
                    message={localization.fields['name'].errorMessage}
                  />
                </div>
                <div className="api-scope-form__container__field">
                  <label
                    htmlFor="apiScope.displayName"
                    className="api-scope-form__label"
                  >
                    {localization.fields['displayName'].label}
                  </label>
                  <input
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    id="apiScope.displayName"
                    name="apiScope.displayName"
                    type="text"
                    className="api-scope-form__input"
                    defaultValue={props.apiScope.displayName}
                    placeholder={localization.fields['displayName'].placeholder}
                    title={localization.fields['displayName'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['displayName'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="apiScope.displayName"
                    message={localization.fields['displayName'].errorMessage}
                  />
                  <TranslationCreateFormDropdown
                    className="apiscope"
                    property="displayName"
                    isEditing={isEditing}
                    id={props.apiScope.name}
                  />
                </div>
                <div className="api-scope-form__container__field">
                  <label
                    htmlFor="apiScope.description"
                    className="api-scope-form__label"
                  >
                    {localization.fields['description'].label}
                  </label>
                  <input
                    ref={register({
                      required: false,
                      validate: ValidationUtils.validateDescription,
                    })}
                    id="apiScope.description"
                    name="apiScope.description"
                    type="text"
                    defaultValue={props.apiScope.description}
                    className="api-scope-form__input"
                    placeholder={localization.fields['description'].placeholder}
                    title={localization.fields['description'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['description'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="apiScope.description"
                    message={localization.fields['description'].errorMessage}
                  />
                  <TranslationCreateFormDropdown
                    className="apiscope"
                    property="description"
                    isEditing={isEditing}
                    id={props.apiScope.name}
                  />
                </div>
                <div className="api-scope-form__container__field">
                  <label
                    htmlFor="apiScope.groupId"
                    className="api-scope-form__label"
                  >
                    {localization.fields['groupId'].label}
                  </label>
                  <select id="apiScope.groupId" name="groupId" ref={register()}>
                    <option
                      value={'null'}
                      selected={props.apiScope.groupId === null}
                    >
                      {localization.fields['groupId'].selectAnItem}
                    </option>
                    {groups.map((group: ApiScopeGroup) => {
                      return (
                        <option
                          value={group.id}
                          key={group.id}
                          selected={group.id === props.apiScope.groupId}
                        >
                          {group.name} - {group.description}
                        </option>
                      )
                    })}
                  </select>
                  <HelpBox helpText={localization.fields['groupId'].helpText} />
                  <ApiScopeGroupCreateFormModal
                    apiScopeGroup={new ApiScopeGroup()}
                    handleChanges={getGroups}
                  ></ApiScopeGroupCreateFormModal>
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label
                    htmlFor="apiScope.enabled"
                    className="api-scope-form__label"
                  >
                    {localization.fields['enabled'].label}
                  </label>
                  <input
                    ref={register}
                    id="apiScope.enabled"
                    name="apiScope.enabled"
                    type="checkbox"
                    defaultChecked={props.apiScope.enabled}
                    className="api-scope-form__checkbox"
                    title={localization.fields['enabled'].helpText}
                  />
                  <HelpBox helpText={localization.fields['enabled'].helpText} />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="api-scope-form__label"
                  >
                    {localization.fields['showInDiscoveryDocument'].label}
                  </label>
                  <input
                    ref={register}
                    id="apiScope.showInDiscoveryDocument"
                    name="apiScope.showInDiscoveryDocument"
                    type="checkbox"
                    defaultChecked={props.apiScope.showInDiscoveryDocument}
                    className="api-scope-form__checkbox"
                    title={
                      localization.fields['showInDiscoveryDocument'].helpText
                    }
                  />
                  <HelpBox
                    helpText={
                      localization.fields['showInDiscoveryDocument'].helpText
                    }
                  />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label
                    htmlFor="apiScope.emphasize"
                    className="api-scope-form__label"
                  >
                    {localization.fields['emphasize'].label}
                  </label>
                  <input
                    ref={register}
                    id="apiScope.emphasize"
                    name="apiScope.emphasize"
                    defaultChecked={props.apiScope.emphasize}
                    type="checkbox"
                    className="api-scope-form__checkbox"
                    title={localization.fields['emphasize'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['emphasize'].helpText}
                  />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label
                    htmlFor="apiScope.isAccessControlled"
                    className="api-scope-form__label"
                  >
                    {localization.fields['isAccessControlled'].label}
                  </label>
                  <input
                    ref={register}
                    id="apiScope.isAccessControlled"
                    name="apiScope.isAccessControlled"
                    type="checkbox"
                    defaultChecked={props.apiScope.isAccessControlled}
                    className="api-scope-form__checkbox"
                    title={localization.fields['isAccessControlled'].helpText}
                  />
                  <HelpBox
                    helpText={
                      localization.fields['isAccessControlled'].helpText
                    }
                  />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label
                    htmlFor="apiScope.required"
                    className="api-scope-form__label"
                  >
                    {localization.fields['required'].label}
                  </label>
                  <input
                    ref={register}
                    id="apiScope.required"
                    name="apiScope.required"
                    defaultChecked={props.apiScope.required}
                    type="checkbox"
                    className="api-scope-form__checkbox"
                    title={localization.fields['required'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['required'].helpText}
                  />
                </div>

                <section className="api-scope__section">
                  <h3>{localization.sections['delegations'].title}</h3>

                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="apiScope.grantToLegalGuardians"
                      className="api-scope-form__label"
                    >
                      {localization.fields['grantToLegalGuardians'].label}
                    </label>
                    <input
                      ref={register}
                      id="apiScope.grantToLegalGuardians"
                      name="apiScope.grantToLegalGuardians"
                      type="checkbox"
                      defaultChecked={props.apiScope.grantToLegalGuardians}
                      className="api-scope-form__checkbox"
                      title={
                        localization.fields['grantToLegalGuardians'].helpText
                      }
                    />
                    <HelpBox
                      helpText={
                        localization.fields['grantToLegalGuardians'].helpText
                      }
                    />
                  </div>

                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="apiScope.grantToProcuringHolders"
                      className="api-scope-form__label"
                    >
                      {localization.fields['grantToProcuringHolders'].label}
                    </label>
                    <input
                      ref={register}
                      id="apiScope.grantToProcuringHolders"
                      name="apiScope.grantToProcuringHolders"
                      type="checkbox"
                      defaultChecked={props.apiScope.grantToProcuringHolders}
                      className="api-scope-form__checkbox"
                      title={
                        localization.fields['grantToProcuringHolders'].helpText
                      }
                    />
                    <HelpBox
                      helpText={
                        localization.fields['grantToProcuringHolders'].helpText
                      }
                    />
                  </div>
                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="apiScope.allowExplicitDelegationGrant"
                      className="api-scope-form__label"
                    >
                      {
                        localization.fields['allowExplicitDelegationGrant']
                          .label
                      }
                    </label>
                    <input
                      ref={register}
                      id="apiScope.allowExplicitDelegationGrant"
                      name="apiScope.allowExplicitDelegationGrant"
                      type="checkbox"
                      defaultChecked={
                        props.apiScope.allowExplicitDelegationGrant
                      }
                      className="api-scope-form__checkbox"
                      title={
                        localization.fields['allowExplicitDelegationGrant']
                          .helpText
                      }
                    />
                    <HelpBox
                      helpText={
                        localization.fields['allowExplicitDelegationGrant']
                          .helpText
                      }
                    />
                  </div>
                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="apiScope.automaticDelegationGrant"
                      className="api-scope-form__label"
                    >
                      {localization.fields['automaticDelegationGrant'].label}
                    </label>
                    <input
                      ref={register}
                      id="apiScope.automaticDelegationGrant"
                      name="apiScope.automaticDelegationGrant"
                      type="checkbox"
                      defaultChecked={props.apiScope.automaticDelegationGrant}
                      className="api-scope-form__checkbox"
                      title={
                        localization.fields['automaticDelegationGrant'].helpText
                      }
                    />
                    <HelpBox
                      helpText={
                        localization.fields['automaticDelegationGrant'].helpText
                      }
                    />
                  </div>

                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="apiScope.alsoForDelegatedUser"
                      className="api-scope-form__label"
                    >
                      {localization.fields['alsoForDelegatedUser'].label}
                    </label>
                    <input
                      ref={register}
                      id="apiScope.alsoForDelegatedUser"
                      name="apiScope.alsoForDelegatedUser"
                      type="checkbox"
                      defaultChecked={props.apiScope.alsoForDelegatedUser}
                      className="api-scope-form__checkbox"
                      title={
                        localization.fields['alsoForDelegatedUser'].helpText
                      }
                    />
                    <HelpBox
                      helpText={
                        localization.fields['alsoForDelegatedUser'].helpText
                      }
                    />
                  </div>
                </section>

                <div className="api-scope-form__buttons__container">
                  <div className="api-scope-form__button__container">
                    <button
                      type="button"
                      className="api-scope-form__button__cancel"
                      onClick={props.handleCancel}
                      title={localization.buttons['cancel'].helpText}
                    >
                      {localization.buttons['cancel'].text}
                    </button>
                  </div>
                  <div className="api-scope-form__button__container">
                    <input
                      type="submit"
                      className="api-scope-form__button__save"
                      disabled={isSubmitting || !available}
                      title={localization.buttons['save'].helpText}
                      value={localization.buttons['save'].text}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiScopeCreateForm
