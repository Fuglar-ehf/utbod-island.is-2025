import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import {
  UnionApi,
  Union,
  PensionApi,
  PensionFund,
} from '@island.is/vmst-client'
import { ParentalLeavePeriod } from './parentalLeavePeriod.model'
import { ParentalLeaveEntitlement } from './parentalLeaveEntitlement.model'
import { ParentalLeavePaymentPlan } from './parentalLeavePaymentPlan.model'

const isRunningInDevelopment = process.env.NODE_ENV === 'development'

enum PensionFundType {
  required = 'L',
  private = 'X',
}

@Injectable()
export class DirectorateOfLabourRepository {
  constructor(private unionApi: UnionApi, private pensionApi: PensionApi) {
    logger.debug('Created Directorate of labour repository')
  }

  async getUnions(): Promise<Union[]> {
    if (isRunningInDevelopment) {
      return [
        {
          id: 'id',
          name: 'VR',
        },
      ]
    }

    const { unions } = await this.unionApi.unionGetUnions()

    if (unions) {
      return unions
    }

    throw new Error('Could not fetch unions')
  }

  private async getAllPensionFunds(): Promise<PensionFund[]> {
    const { pensionFunds } = await this.pensionApi.pensionGetPensionFunds()

    if (pensionFunds) {
      return pensionFunds
    }

    throw new Error('Could not fetch pension funds')
  }

  async getPensionFunds(): Promise<PensionFund[]> {
    if (isRunningInDevelopment) {
      return [
        {
          id: 'id',
          name: 'Frjalsi',
        },
      ]
    }

    const pensionFunds = await this.getAllPensionFunds()

    return pensionFunds.filter((pensionFund) =>
      pensionFund.id.startsWith(PensionFundType.required),
    )
  }

  async getPrivatePensionFunds(): Promise<PensionFund[]> {
    if (isRunningInDevelopment) {
      return [
        {
          id: 'id',
          name: 'Frjalsi',
        },
      ]
    }

    const pensionFunds = await this.getAllPensionFunds()

    return pensionFunds.filter((pensionFund) =>
      pensionFund.id.startsWith(PensionFundType.private),
    )
  }

  async getParentalLeavesEntitlements(
    dateOfBirth: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    nationalId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<ParentalLeaveEntitlement[]> {
    return [
      {
        independentMonths: 5,
        transferableMonths: 1,
      },
    ]
  }

  async getParentalLeavesEstimatedPaymentPlan(
    dateOfBirth: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    period: ParentalLeavePeriod[],
    nationalId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<ParentalLeavePaymentPlan[]> {
    const paymentPlan: ParentalLeavePaymentPlan[] = period.map((p) => {
      return {
        estimatedAmount: 405300,
        pensionAmount: 14800,
        privatePensionAmount: 0,
        unionAmount: 0,
        taxAmount: 77500,
        estimatePayment: 405300,
        period: p,
      }
    })
    return Promise.resolve(paymentPlan)
  }

  async getParentalLeavesApplicationPaymentPlan(
    dateOfBirth: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    applicationId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    nationalId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<ParentalLeavePaymentPlan[]> {
    return [
      {
        estimatedAmount: 1.0,
        pensionAmount: 0.0,
        privatePensionAmount: 0.0,
        unionAmount: 0.0,
        taxAmount: 0.0,
        estimatePayment: 0.0,
        period: {
          from: '01-01-2020',
          to: '01-01-2020',
          ratio: 0.8,
          approved: true,
          paid: true,
        },
      },
    ]
  }
}
