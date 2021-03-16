import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'

import { Injectable } from '@nestjs/common'

import {
  Case,
  CreateCase,
  CreateUser,
  Institution,
  Notification,
  RequestSignatureResponse,
  SendNotification,
  SendNotificationResponse,
  SignatureConfirmationResponse,
  TransitionCase,
  UpdateCase,
  UpdateUser,
  User,
} from '@island.is/judicial-system/types'

import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backend.url}/api`

  willSendRequest(req: RequestOptions) {
    req.headers.set('authorization', this.context.req.headers.authorization)
    req.headers.set('cookie', this.context.req.headers.cookie)
  }

  getInstitutions(): Promise<Institution[]> {
    return this.get('institutions')
  }

  getUsers(): Promise<User[]> {
    return this.get('users')
  }

  getUser(id: string): Promise<User> {
    return this.get(`user/${id}`)
  }

  createUser(createUser: CreateUser): Promise<User> {
    return this.post('user', createUser)
  }

  updateUser(id: string, updateUser: UpdateUser): Promise<User> {
    return this.put(`user/${id}`, updateUser)
  }

  getCases(): Promise<Case[]> {
    return this.get('cases')
  }

  getCase(id: string): Promise<Case> {
    return this.get(`case/${id}`)
  }

  createCase(createCase: CreateCase): Promise<Case> {
    return this.post('case', createCase)
  }

  updateCase(id: string, updateCase: UpdateCase): Promise<Case> {
    return this.put(`case/${id}`, updateCase)
  }

  transitionCase(id: string, transitionCase: TransitionCase): Promise<Case> {
    return this.put(`case/${id}/state`, transitionCase)
  }

  requestSignature(id: string): Promise<RequestSignatureResponse> {
    return this.post(`case/${id}/signature`)
  }

  getSignatureConfirmation(
    id: string,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    return this.get(`case/${id}/signature?documentToken=${documentToken}`)
  }

  sendNotification(
    id: string,
    sendNotification: SendNotification,
  ): Promise<SendNotificationResponse> {
    return this.post(`case/${id}/notification`, sendNotification)
  }

  extendCase(id: string): Promise<Case> {
    return this.post(`case/${id}/extend`)
  }

  getCaseNotifications(id: string): Promise<Notification[]> {
    return this.get(`case/${id}/notifications`)
  }
}

export default BackendAPI
