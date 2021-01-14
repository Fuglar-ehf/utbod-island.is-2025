import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from './../../common/HelpBox'
import NoActiveConnections from './../../common/NoActiveConnections'
import { ApiResourceSecret } from './../../../entities/models/api-resource-secret.model'
import { ApiResourceSecretDTO } from './../../../entities/dtos/api-resource-secret.dto'
import { ResourcesService } from './../../../services/ResourcesService'
import ConfirmModal from './../../common/ConfirmModal'
import InfoModal from './../../common/InfoModal'

interface Props {
  apiResourceName: string
  secrets: ApiResourceSecret[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ApiResourceSecretForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
    ApiResourceSecretDTO
  >()
  const { isSubmitting } = formState
  const defaultSecretLength = 25
  const [defaultSecret, setDefaultSecret] = useState<string>('')
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false)
  const [infoModalIsOpen, setInfoModalIsOpen] = useState(false)
  const [secretValue, setSecretValue] = useState<string>('')
  const [secretToRemove, setSecretToRemove] = useState<ApiResourceSecret>(
    new ApiResourceSecret(),
  )

  const makeDefaultSecret = (length: number) => {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  useEffect(() => {
    setDefaultSecret(makeDefaultSecret(defaultSecretLength))
  }, [])

  const copyToClipboard = (val: string) => {
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = val
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    document.execCommand('copy')
    document.body.removeChild(selBox)
  }

  const add = async (data: ApiResourceSecret) => {
    const secretObj = new ApiResourceSecretDTO()
    secretObj.apiResourceName = props.apiResourceName
    secretObj.description = data.description
    secretObj.type = data.type
    secretObj.value = data.value

    const response = await ResourcesService.addApiResourceSecret(secretObj)
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }

      copyToClipboard(data.value)
      setSecretValue(data.value)
      setInfoModalIsOpen(true)

      const form = document.getElementById('secretForm') as HTMLFormElement
      if (form) {
        form.reset()
      }
      setDefaultSecret(makeDefaultSecret(defaultSecretLength))
    }
  }

  const closeInfoModal = () => {
    setInfoModalIsOpen(false)
  }

  const remove = async () => {
    const secretDTO = new ApiResourceSecretDTO()
    secretDTO.apiResourceName = secretToRemove.apiResourceName
    secretDTO.value = secretToRemove.value
    secretDTO.type = secretToRemove.type
    secretDTO.description = secretToRemove.description

    const response = await ResourcesService.removeApiResourceSecret(secretDTO)
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }

    closeConfirmModal()
  }

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false)
  }

  const confirmRemove = async (secret: ApiResourceSecret) => {
    setSecretToRemove(secret)
    setConfirmModalIsOpen(true)
  }

  const setHeaderElement = () => {
    return (
      <p>
        Are you sure want to delete this secret:{' '}
        <span>{secretToRemove.type}</span> -{' '}
        <span>{secretToRemove.description}</span>
      </p>
    )
  }

  return (
    <div className="api-resource-secret-form">
      <div className="api-resource-secret-form__wrapper">
        <div className="api-resource-secret-form__container">
          <h1>Api Resource Secrets</h1>
          <div className="api-resource-secret-form__container__form">
            <div className="api-resource-secret-form__help">
              The API secret is used for the introspection endpoint. The API can
              authenticate with introspection using the API name and secret.
            </div>
            <form id="secretForm" onSubmit={handleSubmit(add)}>
              <div className="api-resource-secret-form__container__fields">
                <div className="api-resource-secret-form__container__field">
                  <label className="api-resource-secret-form__label">
                    Api resource Secret
                  </label>
                  <input
                    id="secretValue"
                    type="text"
                    name="value"
                    ref={register({ required: true })}
                    defaultValue={defaultSecret}
                    className="api-resource-secret-form__input"
                    placeholder="Some secret text"
                    title="The secret value"
                  />
                  <HelpBox helpText="Your secret value should be a rather complicated string" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="value"
                    message="Value is required"
                  />
                  <input
                    type="submit"
                    className="api-resource-secret-form__button__add"
                    disabled={isSubmitting}
                    value="Add"
                  />
                </div>
                <div className="api-resource-secret-form__container__field">
                  <label className="api-resource-secret-form__label">
                    Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    ref={register({ required: true })}
                    defaultValue={'SharedSecret'}
                    className="api-resource-secret-form__input"
                    placeholder="Type of secret"
                    title="Allowed scopen"
                    readOnly
                  />
                  <HelpBox helpText="SharedSecret is the only type supported" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="type"
                    message="Type is required"
                  />
                </div>
                <div className="api-resource-secret-form__container__field">
                  <label
                    className="api-resource-secret-form__label"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    name="description"
                    ref={register({ required: true })}
                    defaultValue={''}
                    className="api-resource-secret-form__input"
                    placeholder="Secret description"
                    title="Description of the secret"
                  />
                  <HelpBox helpText="Description of the secret" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="description"
                    message="Description is required"
                  />
                </div>
              </div>

              <NoActiveConnections
                title="No secrets are defined"
                show={!props.secrets || props.secrets.length === 0}
                helpText="Add a secret and push the Add button. A random string has been generated for you that you can use if you decide to."
              ></NoActiveConnections>

              <div
                className={`api-resource-secret-form__container__list ${
                  props.secrets && props.secrets.length > 0 ? 'show' : 'hidden'
                }`}
              >
                <h3>Active secrets</h3>
                {props.secrets?.map((secret: ApiResourceSecret) => {
                  return (
                    <div
                      className="api-resource-secret-form__container__list__item"
                      key={secret.created.toString()}
                    >
                      <div className="list-value">{secret.type}</div>
                      <div className="list-name">{secret.description}</div>
                      <div className="list-value">
                        {new Date(secret.created).toDateString()}
                      </div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => confirmRemove(secret)}
                          className="api-resource-secret-form__container__list__button__remove"
                          title="Remove"
                        >
                          <i className="icon__delete"></i>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="api-resource-secret-form__buttons__container">
                <div className="api-resource-secret-form__button__container">
                  <button
                    type="button"
                    className="api-resource-secret-form__button__cancel"
                    onClick={props.handleBack}
                  >
                    Back
                  </button>
                </div>
                <div className="api-resource-secret-form__button__container">
                  <button
                    type="button"
                    className="api-resource-secret-form__button__save"
                    onClick={props.handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ConfirmModal
        modalIsOpen={confirmModalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeConfirmModal}
        confirmation={remove}
        confirmationText="Delete"
      ></ConfirmModal>
      <InfoModal
        modalIsOpen={infoModalIsOpen}
        headerText="Your secret has been copied to your clipboard. Don't lose it, you won't be able to see it again:"
        closeModal={closeInfoModal}
        handleButtonClicked={closeInfoModal}
        infoText={secretValue}
        buttonText="Ok"
      ></InfoModal>
    </div>
  )
}
export default ApiResourceSecretForm
