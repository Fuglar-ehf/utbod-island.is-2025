import { uuid } from 'uuidv4'
import { Base64 } from 'js-base64'
import { Agent } from 'https'
import fetch from 'isomorphic-fetch'

import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'
import {
  CaseState,
  CaseType,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { EventService } from '../event'
import { AwsS3Service } from '../aws-s3'
import { UploadPoliceCaseFileDto } from './dto/uploadPoliceCaseFile.dto'
import { PoliceCaseFile } from './models/policeCaseFile.model'
import { UploadPoliceCaseFileResponse } from './models/uploadPoliceCaseFile.response'
import { policeModuleConfig } from './police.config'
import { PoliceCaseInfo } from './models/policeCaseInfo.model'

@Injectable()
export class PoliceService {
  private xRoadPath: string
  private agent: Agent

  private throttle = Promise.resolve({} as UploadPoliceCaseFileResponse)

  constructor(
    @Inject(policeModuleConfig.KEY)
    private readonly config: ConfigType<typeof policeModuleConfig>,
    private readonly eventService: EventService,
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    this.xRoadPath = createXRoadAPIPath(
      config.tlsBasePathWithEnv,
      XRoadMemberClass.GovernmentInstitution,
      config.policeMemberCode,
      config.policeApiPath,
    )
    this.agent = new Agent({
      cert: config.clientCert,
      key: config.clientKey,
      ca: config.clientPem,
      rejectUnauthorized: false,
    })
  }

  private async fetchPoliceDocumentApi(url: string): Promise<Response> {
    if (!this.config.policeCaseApiAvailable) {
      throw new ServiceUnavailableException('Police document API not available')
    }

    return fetch(url, {
      headers: {
        'X-Road-Client': this.config.clientId,
        'X-API-KEY': this.config.policeApiKey,
      },
      agent: this.agent,
    } as RequestInit)
  }

  private async fetchPoliceCaseApi(
    url: string,
    requestInit: RequestInit,
  ): Promise<Response> {
    if (!this.config.policeCaseApiAvailable) {
      throw new ServiceUnavailableException('Police case API not available')
    }

    return fetch(url, requestInit)
  }

  private async throttleUploadPoliceCaseFile(
    caseId: string,
    caseType: CaseType,
    uploadPoliceCaseFile: UploadPoliceCaseFileDto,
    user: User,
  ): Promise<UploadPoliceCaseFileResponse> {
    await this.throttle.catch((reason) => {
      this.logger.info('Previous upload failed', { reason })
    })

    const pdf = await this.fetchPoliceDocumentApi(
      `${this.xRoadPath}/GetPDFDocumentByID/${uploadPoliceCaseFile.id}`,
    )
      .then(async (res) => {
        if (res.ok) {
          const response = await res.json()

          return Base64.atob(response)
        }

        const reason = await res.text()

        throw new NotFoundException({
          message: `Police case file ${uploadPoliceCaseFile.id} of case ${caseId} not found`,
          detail: reason,
        })
      })
      .catch((reason) => {
        if (reason instanceof NotFoundException) {
          throw reason
        }

        if (reason instanceof ServiceUnavailableException) {
          // Act as if the file was not found
          throw new NotFoundException({
            ...reason,
            message: `Police case file ${uploadPoliceCaseFile.id} of case ${caseId} not found`,
            detail: reason.message,
          })
        }

        this.eventService.postErrorEvent(
          'Failed to get police case file',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            caseFileId: uploadPoliceCaseFile.id,
            name: uploadPoliceCaseFile.name,
          },
          reason,
        )

        throw new BadGatewayException({
          ...reason,
          message: `Failed to get police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
          detail: reason.message,
        })
      })

    const key = `${
      isIndictmentCase(caseType) ? 'indictments' : 'uploads'
    }/${caseId}/${uuid()}/${uploadPoliceCaseFile.name}`

    await this.awsS3Service.putObject(key, pdf)

    return { key, size: pdf.length }
  }

  async getAllPoliceCaseFiles(
    caseId: string,
    user: User,
  ): Promise<PoliceCaseFile[]> {
    const promise = this.config.policeCaseApiV2Available
      ? this.fetchPoliceDocumentApi(
          `${this.xRoadPath}/V2/GetDocumentListById/${caseId}`,
        )
      : this.fetchPoliceDocumentApi(
          `${this.xRoadPath}/GetDocumentListById/${caseId}`,
        )

    return promise
      .then(async (res: Response) => {
        if (res.ok) {
          if (this.config.policeCaseApiV2Available) {
            const response = await res.json()

            return (
              response.skjol?.map(
                (file: {
                  rvMalSkjolMals_ID: string
                  heitiSkjals: string
                  malsnumer: string
                  dagsStofnad: string
                }) => ({
                  id: file.rvMalSkjolMals_ID,
                  name: file.heitiSkjals.endsWith('.pdf')
                    ? file.heitiSkjals
                    : `${file.heitiSkjals}.pdf`,
                  policeCaseNumber: file.malsnumer,
                  displayDate: file.dagsStofnad,
                }),
              ) ?? []
            )
          } else {
            const response = await res.json()

            return response.map(
              (file: {
                rvMalSkjolMals_ID: string
                heitiSkjals: string
                malsnumer: string
                dagsStofnad: string
              }) => ({
                id: file.rvMalSkjolMals_ID,
                name: file.heitiSkjals.endsWith('.pdf')
                  ? file.heitiSkjals
                  : `${file.heitiSkjals}.pdf`,
                policeCaseNumber: file.malsnumer,
                displayDate: file.dagsStofnad,
              }),
            )
          }
        }

        const reason = await res.text()

        // The police system does not provide a structured error response.
        // When a police case does not exist, a stack trace is returned.
        throw new NotFoundException({
          message: `Police case for case ${caseId} does not exist`,
          detail: reason,
        })
      })
      .catch((reason) => {
        if (reason instanceof NotFoundException) {
          throw reason
        }

        if (reason instanceof ServiceUnavailableException) {
          // Act as if the case does not exist
          throw new NotFoundException({
            ...reason,
            message: `Police case for case ${caseId} does not exist`,
            detail: reason.message,
          })
        }

        this.eventService.postErrorEvent(
          'Failed to get police case files',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
          },
          reason,
        )

        throw new BadGatewayException({
          ...reason,
          message: `Failed to get police case files for case ${caseId}`,
          detail: reason.message,
        })
      })
  }

  async getPoliceCaseInfo(
    caseId: string,
    user: User,
  ): Promise<PoliceCaseInfo[]> {
    const promise = this.fetchPoliceDocumentApi(
      `${this.xRoadPath}/V2/GetDocumentListById/${caseId}`,
    )

    return promise
      .then(async (res: Response) => {
        if (res.ok) {
          const response = await res.json()

          const cases: PoliceCaseInfo[] = [
            { policeCaseNumber: response.malsnumer },
          ]

          response.skjol?.map((info: { malsnumer: string }) => {
            if (
              !cases.find((item) => item.policeCaseNumber === info.malsnumer)
            ) {
              cases.push({ policeCaseNumber: info.malsnumer })
            }
          })

          response.malseinings?.forEach(
            (info: {
              upprunalegtMalsnumer: string
              vettvangur: string
              brotFra: string
            }) => {
              const foundCase = cases.find(
                (item) => item.policeCaseNumber === info.upprunalegtMalsnumer,
              )
              if (!foundCase) {
                cases.push({ policeCaseNumber: info.upprunalegtMalsnumer })
              } else {
                foundCase.place = info.vettvangur
                foundCase.date = info.brotFra
                  ? new Date(info.brotFra)
                  : undefined
              }
            },
          )
          return cases
        }

        const reason = await res.text()

        // The police system does not provide a structured error response.
        // When a police case does not exist, a stack trace is returned.
        throw new NotFoundException({
          message: `Police case info for case ${caseId} does not exist`,
          detail: reason,
        })
      })
      .catch((reason) => {
        if (reason instanceof NotFoundException) {
          throw reason
        }

        if (reason instanceof ServiceUnavailableException) {
          // Act as if the case does not exist
          throw new NotFoundException({
            ...reason,
            message: `Police case info for case ${caseId} does not exist`,
            detail: reason.message,
          })
        }

        this.eventService.postErrorEvent(
          'Failed to get police case info',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
          },
          reason,
        )

        throw new BadGatewayException({
          ...reason,
          message: `Failed to get police case info for case ${caseId}`,
          detail: reason.message,
        })
      })
  }

  async uploadPoliceCaseFile(
    caseId: string,
    caseType: CaseType,
    uploadPoliceCaseFile: UploadPoliceCaseFileDto,
    user: User,
  ): Promise<UploadPoliceCaseFileResponse> {
    this.throttle = this.throttleUploadPoliceCaseFile(
      caseId,
      caseType,
      uploadPoliceCaseFile,
      user,
    )

    return this.throttle
  }

  async updatePoliceCase(
    user: User,
    caseId: string,
    caseType: CaseType,
    caseState: CaseState,
    policeCaseNumber: string,
    defendantNationalId: string,
    validToDate: Date,
    caseConclusion: string,
    requestPdf: string,
    courtRecordPdf: string,
    rulingPdf: string,
    custodyNoticePdf?: string,
  ): Promise<boolean> {
    return this.fetchPoliceCaseApi(
      `${this.xRoadPath}/V2/UpdateRVCase/${caseId}`,
      {
        method: 'PUT',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          'X-Road-Client': this.config.clientId,
          'X-API-KEY': this.config.policeApiKey,
        },
        agent: this.agent,
        body: JSON.stringify({
          rvMal_ID: caseId,
          caseNumber: policeCaseNumber,
          ssn: defendantNationalId,
          type: caseType,
          courtVerdict: caseState,
          expiringDate: validToDate?.toISOString(),
          courtVerdictString: caseConclusion,
          courtDocuments: [
            { type: 'RVKR', courtDocument: Base64.btoa(requestPdf) },
            { type: 'RVTB', courtDocument: Base64.btoa(courtRecordPdf) },
            { type: 'RVUR', courtDocument: Base64.btoa(rulingPdf) },
            ...(custodyNoticePdf
              ? [
                  {
                    type: 'RVVI',
                    courtDocument: Base64.btoa(custodyNoticePdf),
                  },
                ]
              : []),
          ],
        }),
      } as RequestInit,
    )
      .then(async (res) => {
        if (res.ok) {
          return true
        }

        const response = await res.text()

        throw response
      })
      .catch((reason) => {
        if (reason instanceof ServiceUnavailableException) {
          // Do not spam the logs with errors
          // Act as if the case was updated
          return true
        } else {
          this.logger.error(`Failed to update police case ${caseId}`, {
            reason,
          })
        }

        this.eventService.postErrorEvent(
          'Failed to update police case',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            caseType,
            caseState,
            policeCaseNumber,
          },
          reason,
        )

        return false
      })
  }
}
