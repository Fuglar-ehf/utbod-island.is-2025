import {
  InternalServerErrorException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { logger } from '@island.is/logging'
import format from 'date-fns/format'

import {
  GetSjukratryggdurTypeDto,
  GetFaUmsoknSjukratryggingTypeDto,
  GetVistaSkjalDtoType,
  GetVistaSkjalBody,
  Fylgiskjal,
  Fylgiskjol,
} from './dto'
import { SoapClient } from './soapClient'
import { VistaSkjalModel } from '../graphql/models'
import { VistaSkjalInput } from '../types'
import { BucketService } from '../bucket.service'

export const HEALTH_INSURANCE_CONFIG = 'HEALTH_INSURANCE_CONFIG'

export interface HealthInsuranceConfig {
  wsdlUrl: string
  baseUrl: string
  username: string
  password: string
}

@Injectable()
export class HealthInsuranceAPI {
  constructor(
    @Inject(HEALTH_INSURANCE_CONFIG)
    private clientConfig: HealthInsuranceConfig,
    @Inject(BucketService)
    private bucketService: BucketService,
  ) {}

  public async getProfun(): Promise<string> {
    logger.info(`--- Starting getProfun api call ---`)

    const args = {
      sendandi: '',
    }
    const res = await this.xroadCall('profun', args)
    return res.ProfunType.radnumer_si ?? null
  }

  // check whether the person is health insured
  public async isHealthInsured(nationalId: string): Promise<boolean> {
    logger.info(`--- Starting isHealthInsured api call for ${nationalId} ---`)

    const args = {
      sendandi: '',
      kennitala: nationalId,
      dagsetning: Date.now(),
    }
    const res: GetSjukratryggdurTypeDto = await this.xroadCall(
      'sjukratryggdur',
      args,
    )

    if (!res.SjukratryggdurType) {
      logger.error(
        `Something went totally wrong in 'Sjukratryggdur' call for ${nationalId} with result: ${JSON.stringify(
          res,
          null,
          2,
        )}`,
      )
      throw new NotFoundException(`Unexpected results: ${JSON.stringify(res)}`)
    } else {
      logger.info(`--- Finished isHealthInsured api call for ${nationalId} ---`)
      return res.SjukratryggdurType.sjukratryggdur == 1
    }
  }

  // get user's pending applications
  public async getPendingApplication(nationalId: string): Promise<number[]> {
    logger.info(
      `--- Starting getPendingApplication api call for ${nationalId} ---`,
    )

    const args = {
      sendandi: '',
      kennitala: nationalId,
    }
    /*
      API returns null when there is no application in the system,
      but it returns also null when the nationalId is not correct,
      we return all reponses to developer to handle them

      Application statuses:
      0: Samþykkt/Accepted
      1: Synjað/Refused
      2: Í bið/Pending
      3: Ógilt/Invalid
    */
    const res: GetFaUmsoknSjukratryggingTypeDto = await this.xroadCall(
      'faumsoknirsjukratrygginga',
      args,
    )

    if (!res.FaUmsoknSjukratryggingType?.umsoknir) {
      logger.info(`return empty array to graphQL`)
      return []
    }

    logger.info(`Start filtering Pending status`)
    // Return all caseIds with Pending status
    const pendingCases: number[] = []
    res.FaUmsoknSjukratryggingType.umsoknir
      .filter((umsokn) => {
        return umsokn.stada == 2
      })
      .forEach((value) => {
        pendingCases.push(value.skjalanumer)
      })

    logger.info(
      `--- Finished getPendingApplication api call for ${nationalId} ---`,
    )
    return pendingCases
  }

  // Apply Insurance without attachment
  public async applyInsurance(
    appNumber: number,
    inputObj: VistaSkjalInput,
    nationalId: string,
  ): Promise<VistaSkjalModel> {
    logger.info(
      `--- Starting applyInsurance api call for ${
        inputObj.nationalId ?? nationalId
      } ---`,
    )

    const vistaSkjalBody: GetVistaSkjalBody = {
      sjukratryggingumsokn: {
        einstaklingur: {
          kennitala: inputObj.nationalId ?? nationalId,
          erlendkennitala: inputObj.foreignNationalId,
          nafn: inputObj.name,
          heimili: inputObj.address ?? '',
          postfangstadur: inputObj.postalAddress ?? '',
          rikisfang: inputObj.citizenship ?? '',
          rikisfangkodi: inputObj.postalAddress ? 'IS' : '',
          simi: inputObj.phoneNumber,
          netfang: inputObj.email,
        },
        numerumsoknar: inputObj.applicationNumber,
        dagsumsoknar: format(new Date(inputObj.applicationDate), 'yyyy-MM-dd'),
        dagssidustubusetuthjodskra: format(
          new Date(inputObj.residenceDateFromNationalRegistry),
          'yyyy-MM-dd',
        ),
        dagssidustubusetu: format(
          new Date(inputObj.residenceDateUserThink),
          'yyyy-MM-dd',
        ),
        stadaeinstaklings: inputObj.userStatus,
        bornmedumsaekjanda: inputObj.isChildrenFollowed,
        fyrrautgafuland: inputObj.previousCountry,
        fyrrautgafulandkodi: inputObj.previousCountryCode,
        fyrriutgafustofnunlands: inputObj.previousIssuingInstitution,
        tryggdurfyrralandi: inputObj.isHealthInsuredInPreviousCountry,
        vidbotarupplysingar: inputObj.additionalInformation ?? '',
      },
    }

    // Add attachments from S3 bucket
    // Attachment's name need to be exactly same as the file name, including file type (ex: skra.txt)

    if (
      inputObj.attachmentsFileNames &&
      inputObj.attachmentsFileNames.length > 0
    ) {
      logger.info(`Start getting attachments`)
      const fylgiskjol: Fylgiskjol = {
        fylgiskjal: [],
      }
      for (let i = 0; i < inputObj.attachmentsFileNames.length; i++) {
        const filename = inputObj.attachmentsFileNames[i]
        const fylgiskjal: Fylgiskjal = {
          heiti: filename,
          innihald: await this.bucketService.getFileContentAsBase64(filename),
        }
        fylgiskjol.fylgiskjal.push(fylgiskjal)
      }
      vistaSkjalBody.sjukratryggingumsokn.fylgiskjol = fylgiskjol
      logger.info(`Finished getting attachments`)
    }

    const xml = `<![CDATA[<?xml version="1.0" encoding="ISO-8859-1"?>${this.OBJtoXML(
      vistaSkjalBody,
    )}]]>`

    // TODO: clean up when go live
    // let attachments = ''
    // if (
    //   inputObj.attachmentsFileNames &&
    //   inputObj.attachmentsFileNames.length > 0
    // ) {
    //   logger.info(`Start getting attachments`)
    //   attachments += '<fylgiskjol>'
    //   for (let i = 0; i < inputObj.attachmentsFileNames.length; i++) {
    //     const filename = inputObj.attachmentsFileNames[i]
    //     logger.info(`Getting ${filename} now`)
    //     const resultStr = await this.bucketService.getFileContentAsBase64(
    //       filename,
    //     )
    //     attachments += `<fylgiskjal>
    //                       <heiti>${filename}</heiti>
    //                       <innihald>${resultStr}</innihald>
    //                     </fylgiskjal>`
    //   }
    //   attachments += '</fylgiskjol>'
    //   logger.info(`Finished getting attachments`)
    // }

    // const xml = `<![CDATA[<?xml version="1.0" encoding="ISO-8859-1"?>
    // <sjukratryggingumsokn xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    //   <einstaklingur>
    //     <kennitala>${inputObj.nationalId ?? nationalId}</kennitala>
    //     <erlendkennitala>${inputObj.foreignNationalId}</erlendkennitala>
    //     <nafn>${inputObj.name}</nafn>
    //     <heimili>${inputObj.address ?? ''}</heimili>
    //     <postfangstadur>${inputObj.postalAddress ?? ''}</postfangstadur>
    //     <rikisfang>${inputObj.citizenship ?? ''}</rikisfang>
    //     <rikisfangkodi>${inputObj.postalAddress ? 'IS' : ''}</rikisfangkodi>
    //     <simi>${inputObj.phoneNumber}</simi>
    //     <netfang>${inputObj.email}</netfang>
    //   </einstaklingur>
    //   <numerumsoknar>${inputObj.applicationNumber}</numerumsoknar>
    //   <dagsumsoknar>${format(
    //     new Date(inputObj.applicationDate),
    //     'yyyy-MM-dd',
    //   )}</dagsumsoknar>
    //   <dagssidustubusetuthjodskra>${format(
    //     new Date(inputObj.residenceDateFromNationalRegistry),
    //     'yyyy-MM-dd',
    //   )}</dagssidustubusetuthjodskra>
    //   <dagssidustubusetu>${format(
    //     new Date(inputObj.residenceDateUserThink),
    //     'yyyy-MM-dd',
    //   )}</dagssidustubusetu>
    //   <stadaeinstaklings>${inputObj.userStatus}</stadaeinstaklings>
    //   <bornmedumsaekjanda>${inputObj.isChildrenFollowed}</bornmedumsaekjanda>
    //   <fyrrautgafuland>${inputObj.previousCountry}</fyrrautgafuland>
    //   <fyrrautgafulandkodi>${inputObj.previousCountryCode}</fyrrautgafulandkodi>
    //   <fyrriutgafustofnunlands>${
    //     inputObj.previousIssuingInstitution
    //   }</fyrriutgafustofnunlands>
    //   <tryggdurfyrralandi>${
    //     inputObj.isHealthInsuredInPreviousCountry
    //   }</tryggdurfyrralandi>
    //   <vidbotarupplysingar>${
    //     inputObj.additionalInformation ?? ''
    //   }</vidbotarupplysingar>
    //   ${attachments}
    // </sjukratryggingumsokn>]]>`

    const args = {
      sendandi: '',
      tegundskjals: appNumber,
      skjal: xml,
    }
    /*
      Application statuses:
      0: annars/hafnað/Rejected
      1: tókst/Succeeded
      2: tókst en með athugasemd/Succeeded but with comment
    */
    logger.info(`Calling vistaskjal through xroad`)
    const res: GetVistaSkjalDtoType = await this.xroadCall('vistaskjal', args)

    const vistaSkjal = new VistaSkjalModel()
    if (!res.VistaSkjalType?.tokst) {
      logger.info(
        `Failed to upload document to sjukra because: ${
          res.VistaSkjalType.villulysing ?? 'unknown error'
        }`,
      )
      vistaSkjal.isSucceeded = false
      vistaSkjal.comment = res.VistaSkjalType?.villulysing ?? 'Unknown error'

      if (
        res.VistaSkjalType.villulisti &&
        res.VistaSkjalType.villulisti.length > 0
      ) {
        if (res.VistaSkjalType.villulisti[0].villulysinginnri) {
          vistaSkjal.comment = res.VistaSkjalType.villulisti[0].villulysinginnri
        }
      }

      return vistaSkjal
    }

    vistaSkjal.isSucceeded = true
    vistaSkjal.caseId = res.VistaSkjalType.skjalanumer_si
    vistaSkjal.comment = res.VistaSkjalType.villulysing ?? ''

    logger.info(`--- Finished applyInsurance api call ---`)
    return vistaSkjal
  }

  public async xroadCall(functionName: string, args: object): Promise<any> {
    // create 'soap' client
    logger.info(`Start ${functionName} function call.`)
    const client = await SoapClient.generateClient(
      this.clientConfig.wsdlUrl,
      this.clientConfig.baseUrl,
      this.clientConfig.username,
      this.clientConfig.password,
      functionName,
    )
    if (!client) {
      logger.error('HealthInsurance Soap Client not initialized')
      throw new InternalServerErrorException(
        'HealthInsurance Soap Client not initialized',
      )
    }

    return new Promise((resolve, reject) => {
      // call 'faumsoknirsjukratrygginga' function/endpoint
      client[functionName](args, function (err: any, result: any) {
        if (err) {
          logger.error(JSON.stringify(err, null, 2))
          reject(err)
        } else {
          logger.info(`Successful call ${functionName} function`)
          resolve(result)
        }
      })
    })
  }

  private OBJtoXML(obj: object) {
    let xml = ''
    Object.entries(obj).forEach((entry) => {
      const [key, value] = entry
      xml += value instanceof Array ? '' : '<' + key + '>'
      if (value instanceof Array) {
        for (const i in value) {
          xml += '<' + key + '>'
          xml += this.OBJtoXML(value[i])
          xml += '</' + key + '>'
        }
      } else if (typeof value == 'object') {
        xml += this.OBJtoXML(new Object(value))
      } else {
        xml += value
      }
      xml += value instanceof Array ? '' : '</' + key + '>'
    })
    return xml
  }
}
