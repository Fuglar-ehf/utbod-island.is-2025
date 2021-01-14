/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import NotFound from '../../common/NotFound'
import { UserService } from '../../../services/UserService'
import UserIdentity from './../../../entities/models/user-identity.model'
import { Claim } from './../../../entities/models/claim.model'

interface ClaimShow {
  subjectId: string
  show: boolean
}

interface FormOutput {
  id: string
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<UserIdentity[]>([])
  const [id, setId] = useState<string>('')
  const [claimShow, setClaimShow] = useState<ClaimShow[]>([])
  const [showNotFound, setShowNotFound] = useState<boolean>(false)
  const { handleSubmit, register, errors, formState } = useForm()
  const { isSubmitting } = formState

  const getIndex = (subjectId: string): number => {
    for (let i = 0; i < claimShow.length; i++) {
      if (claimShow[i].subjectId === subjectId) {
        return i
      }
    }
    return -1
  }

  const getUser = async (data: FormOutput) => {
    setShowNotFound(false)
    const response = await UserService.findUser(data.id)
    if (response) {
      setUsers(response)
    } else {
      setShowNotFound(true)
      setUsers([])
    }

    setId(data.id)
  }

  const toggleActive = async (user: UserIdentity) => {
    await UserService.toggleActive(user.subjectId, !user.active)
    getUser({ id: id })
  }

  const handleShowClaimsClicked = (
    user: UserIdentity,
    show = true,
  ): ClaimShow => {
    const index = getIndex(user.subjectId)
    let ret = { subjectId: user.subjectId, show: show }
    if (index === -1) {
      claimShow.push(ret)
    } else {
      claimShow[index].show = !claimShow[index].show
      ret = claimShow[index]
    }

    setClaimShow([...claimShow])
    return ret
  }

  const showClaims = (user: UserIdentity): boolean => {
    const index = getIndex(user.subjectId)
    if (index === -1) {
      return false
    } else {
      return claimShow[index].show
    }
  }

  return (
    <div className="users">
      <div className="users__wrapper">
        <div className="users__container">
          <h1>User management</h1>
          <div className="users__container__form">
            <form onSubmit={handleSubmit(getUser)}>
              <div className="users__container__fields">
                <div className="users__container__field">
                  <label className="users__label" htmlFor="search">
                    Search by National Id or Subject Id
                  </label>
                  <input
                    id="search"
                    type="text"
                    name="id"
                    defaultValue={''}
                    className="users__search__input"
                    ref={register({ required: true })}
                    placeholder="0123456789"
                  />
                  <HelpBox helpText="You can search for user identities by national Id or User Identity subject Id. National ID must be typed in as a number with 10 number characters otherwise you will be looking up by Subject Id" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="id"
                    message="SubjectId or nationalId is required. NationalId must 10 numeric characters"
                  />
                  <input
                    type="submit"
                    value="Search"
                    disabled={isSubmitting}
                    className="users__button__search"
                  />
                </div>
              </div>
            </form>
          </div>

          <div
            className={`users__container__table ${
              users && users.length > 0 ? 'show' : 'hidden'
            }`}
          >
            <h3>Users found:</h3>
            <table className="users__table">
              <thead>
                <tr>
                  <th>Subject Id</th>
                  <th>Name</th>
                  <th>Provider Name</th>
                  <th>Provider Subject Id</th>
                  <th colSpan={2}></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: UserIdentity) => {
                  return (
                    <tr key={user.subjectId}>
                      <td>{user.subjectId}</td>
                      <td>{user.name}</td>
                      <td>{user.providerName}</td>
                      <td>{user.providerSubjectId}</td>
                      <td className="overlay-container">
                        <button
                          type="button"
                          className="users__button__view"
                          onClick={() => handleShowClaimsClicked(user)}
                        >
                          View claims
                        </button>

                        <div
                          className={`users__claim__overlay users__container__list ${
                            showClaims(user) ? 'show' : 'hidden'
                          }`}
                        >
                          <a
                            className="users__container__button__close"
                            onClick={() => handleShowClaimsClicked(user)}
                          >
                            &times;
                          </a>
                          {user.claims?.map((claim: Claim) => {
                            return (
                              <div
                                className="users__container__list__item"
                                key={claim.type}
                              >
                                <div className="list-name">{claim.type}:</div>
                                <div className="list-value">{claim.value}</div>
                              </div>
                            )
                          })}
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`users__button__delete ${
                            user.active === true
                              ? 'button__warning'
                              : 'button__ok'
                          }`}
                          onClick={() => toggleActive(user)}
                          title={
                            user.active
                              ? 'User is active. Click to deactivate'
                              : 'User is deactivated. Click to activate'
                          }
                        >
                          {user.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {showNotFound && (
            <NotFound title="User Identity not found">
              Nothing found for: {id}
            </NotFound>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsersList
