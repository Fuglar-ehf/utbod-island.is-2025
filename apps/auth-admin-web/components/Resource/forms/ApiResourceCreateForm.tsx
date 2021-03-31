import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ApiResourcesDTO } from '../../../entities/dtos/api-resources-dto'
import { ResourcesService } from '../../../services/ResourcesService'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationCreateFormDropdown from '../../Admin/form/TranslationCreateFormDropdown'

interface Props {
  handleSave?: (object: ApiResourcesDTO) => void
  handleCancel?: () => void
  apiResource: ApiResourcesDTO
}

const ResourceCreateForm: React.FC<Props> = (props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm<ApiResourcesDTO>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [available, setAvailable] = useState<boolean>(false)
  const [nameLength, setNameLength] = useState(0)

  useEffect(() => {
    if (props.apiResource && props.apiResource.name) {
      setIsEditing(true)
      setAvailable(true)
    }
  }, [props.apiResource])

  const checkAvailability = async (name: string) => {
    setNameLength(name.length)
    const response = await ResourcesService.getApiResourceByName(name)
    if (response) {
      setAvailable(false)
    } else {
      setAvailable(true)
    }
  }

  const save = async (data: ApiResourcesDTO) => {
    let response = null

    if (!isEditing) {
      response = await ResourcesService.createApiResource(data)
    } else {
      response = await ResourcesService.updateApiResource(data, data.name)
    }

    if (response) {
      if (props.handleSave) {
        props.handleSave(data)
      }
    }
  }

  return (
    <div className="api-resource-form">
      <div className="api-resource-form__wrapper">
        <div className="api-resource-form__container">
          <h1>{isEditing ? 'Edit Api Resource' : 'Create Api Resource'}</h1>
          <div className="api-resource-form__container__form">
            <div className="api-resource-form__help">
              The server hosting the protected resources, and which is capable
              of accepting and responding to protected resource requests using
              access tokens.
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="api-resource-form__container__fields">
                <div className="api-resource-form__container__field">
                  <label className="api-resource-form__label">
                    National Id (Kennitala)
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    ref={register({
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                      validate: ValidationUtils.validateNationalId,
                    })}
                    defaultValue={props.apiResource.nationalId}
                    className="api-resource-form__input"
                    placeholder="0123456789"
                    maxLength={10}
                    title="The nationalId (Kennitala) registered for the api-resource-form"
                  />
                  <HelpBox helpText="The nationalId (Kennitala) registered for the api-resource-form" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="nationalId"
                    message="NationalId must be 10 numeric characters"
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label className="client-basic__label">Contact email</label>
                  <input
                    type="text"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateEmail,
                    })}
                    name="contactEmail"
                    defaultValue={props.apiResource.contactEmail ?? ''}
                    className="api-resource-form__input"
                    title="The email of the person who can be contacted regarding this API Resource"
                    placeholder="john@example.com"
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="contactEmail"
                    message="Contact email must be set and must be a valid email address"
                  />
                  <HelpBox helpText="The email of the person who can be contacted regarding this API Resource" />
                </div>
                <div className="api-resource-form__container__field">
                  <label htmlFor="name" className="api-resource-form__label">
                    Name
                  </label>
                  <input
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                    id="name"
                    name="name"
                    type="text"
                    className="api-resource-form__input"
                    defaultValue={props.apiResource.name}
                    readOnly={isEditing}
                    onChange={(e) => checkAvailability(e.target.value)}
                  />
                  <div
                    className={`api-resource-form__container__field__available ${
                      available ? 'ok ' : 'taken '
                    } ${nameLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {available ? 'Available' : 'Unavailable'}
                  </div>
                  <HelpBox helpText="The unique name of the API. This value is used for authentication with introspection and will be added to the audience of the outgoing access token." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="name"
                    message="Name is required and needs to be in the right format"
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label
                    htmlFor="displayName"
                    className="api-resource-form__label"
                  >
                    Display Name
                  </label>
                  <input
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    id="displayName"
                    name="displayName"
                    type="text"
                    className="api-resource-form__input"
                    defaultValue={props.apiResource.displayName}
                  />
                  <HelpBox helpText="The Display Name value can be used e.g. on the consent screen." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="displayName"
                    message="Display name is required"
                  />
                  <TranslationCreateFormDropdown
                    className="apiresource"
                    property="displayName"
                    isEditing={isEditing}
                    id={props.apiResource.name}
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label
                    htmlFor="description"
                    className="api-resource-form__label"
                  >
                    Description
                  </label>
                  <input
                    ref={register({
                      required: false,
                      validate: ValidationUtils.validateDescription,
                    })}
                    id="description"
                    name="description"
                    type="text"
                    defaultValue={props.apiResource.description}
                    className="api-resource-form__input"
                  />
                  <HelpBox helpText="The Description value can be used e.g. on the consent screen." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="description"
                    message="Description can not contain special characters"
                  />
                  <TranslationCreateFormDropdown
                    className="apiresource"
                    property="description"
                    isEditing={isEditing}
                    id={props.apiResource.name}
                  />
                </div>

                <div className="api-resource-form__container__checkbox__field">
                  <label htmlFor="enabled" className="api-resource-form__label">
                    Enabled
                  </label>
                  <input
                    ref={register}
                    id="enabled"
                    name="enabled"
                    type="checkbox"
                    defaultChecked={props.apiResource.enabled}
                    className="api-resource-form__checkbox"
                  />
                  <HelpBox helpText="Indicates if this resource is enabled and can be requested." />
                </div>

                <div className="api-resource-form__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="api-resource-form__label"
                  >
                    Show In Discovery Document
                  </label>
                  <input
                    ref={register}
                    id="showInDiscoveryDocument"
                    name="showInDiscoveryDocument"
                    type="checkbox"
                    defaultChecked={props.apiResource.showInDiscoveryDocument}
                    className="api-resource-form__checkbox"
                  />
                  <HelpBox helpText="Specifies whether this resource is shown in the discovery document." />
                </div>

                <div className="api-resource-form__buttons__container">
                  <div className="api-resource-form__button__container">
                    <button
                      type="button"
                      className="api-resource-form__button__cancel"
                      onClick={props.handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="api-resource-form__button__container">
                    <input
                      type="submit"
                      className="api-resource-form__button__save"
                      disabled={isSubmitting || !available}
                      value="Next"
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

export default ResourceCreateForm
