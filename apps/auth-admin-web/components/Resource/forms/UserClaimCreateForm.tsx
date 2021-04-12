import React, { useEffect, useState } from 'react'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { useForm } from 'react-hook-form'
import ValidationUtils from './../../../utils/validation.utils'
import { UserClaimDTO } from './../../../entities/dtos/user-claim-dto'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'

interface Props {
  resourceName: string
  handleSave: (claimName: string) => void
  existingClaims: string[]
}

const UserClaimCreateForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, reset } = useForm<UserClaimDTO>()
  const [visible, setVisible] = useState<boolean>(false)
  const [isAvailable, setIsAvailable] = useState<boolean>(true)
  const [claimLength, setClaimLength] = useState<number>(0)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('UserClaimCreateForm'),
  )

  const save = (data: UserClaimDTO): void => {
    props.handleSave(data.claimName)
    setVisible(false)
    setClaimLength(0)
    reset()
  }

  const checkAvailability = async (claimName: string) => {
    setClaimLength(claimName.length)
    const lowercaseArray = props.existingClaims.map((x) => x.toLowerCase())
    if (lowercaseArray.includes(claimName.toLowerCase())) {
      setIsAvailable(false)
    } else {
      setIsAvailable(true)
    }
  }

  return (
    <div className="user-claim-create-form">
      <div className="user-claim-create-form__button__show">
        <a
          className="user-claim__button__show"
          onClick={() => setVisible(!visible)}
          title={`Create new claim`}
        >
          <i className="icon__new"></i>
          <span>{localization.title}</span>
        </a>
      </div>

      <div
        className={`user-claim-create-form__wrapper ${
          visible ? 'show' : 'hidden'
        }`}
      >
        <div className="user-claim-create-form__container">
          <h1>{localization.title}</h1>

          <div className="user-claim-create-form__container__form">
            <div className="user-claim-create-form__help">
              {localization.help}
            </div>

            <form onSubmit={handleSubmit(save)}>
              <div className="user-claim-create-form__container__fields">
                <div className="user-claim-create-form__container__field">
                  <label
                    className="user-claim-create-form__label"
                    htmlFor="claimName"
                  >
                    {localization.fields['claimName'].label}
                  </label>
                  <input
                    id="claimName"
                    type="text"
                    name="claimName"
                    className="user-claim-create-form__input"
                    placeholder={localization.fields['claimName'].placeholder}
                    title={localization.fields['claimName'].helpText}
                    onChange={(e) => checkAvailability(e.target.value)}
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                  />
                  <div
                    className={`user-claim-create-form__container__field__available ${
                      isAvailable ? 'ok ' : 'taken '
                    } ${claimLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </div>

                  <HelpBox
                    helpText={localization.fields['claimName'].helpText}
                  />

                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="claimName"
                    message={localization.fields['claimName'].errorMessage}
                  />
                </div>
              </div>

              <div className="user-claim-create-form__buttons__container">
                <div className="user-claim-create-form__button__container">
                  <button
                    type="button"
                    className="user-claim-create-form__button__cancel"
                    value="Cancel"
                    onClick={(e) => setVisible(false)}
                  >
                    {localization.cancelButton}
                  </button>
                </div>
                <div className="user-claim-create-form__button__container">
                  <button
                    type="submit"
                    className="user-claim-create-form__button__save"
                    value="Save"
                    disabled={!isAvailable}
                  >
                    {localization.saveButton}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UserClaimCreateForm
