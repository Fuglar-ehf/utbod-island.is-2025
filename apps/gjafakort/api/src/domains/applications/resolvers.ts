import { ForbiddenError } from 'apollo-server-express'

import { authorize } from '../auth'
import { applicationService, ferdalagService, rskService } from '../../services'

class ApplicationResolver {
  @authorize()
  public async createApplication(_, { input }, context) {
    const company = await rskService.getCompanyBySSN(
      context.user.ssn,
      input.companySSN,
    )
    if (!company) {
      throw new ForbiddenError('Company not found!')
    }

    const serviceProviders = await ferdalagService.getServiceProviders(
      input.companySSN,
    )
    let state = 'approved'
    const comments = []
    if (serviceProviders.length > 1) {
      state = 'pending'
      comments.push('Multiple service providers found for ssn')
    } else if (serviceProviders.length < 1) {
      state = 'pending'
      comments.push('No service provider found for ssn')
    }

    const application = await applicationService.createApplication(
      input,
      context,
      state,
      comments,
    )
    return {
      application: {
        id: application.id,
        name: application.data.name,
        email: application.data.email,
        state: application.state,
        companySSN: application.data.companySSN,
        serviceCategory: application.data.serviceCategory,
        generalEmail: application.data.generalEmail,
        webpage: application.data.webpage,
        phoneNumber: application.data.phoneNumber,
        approveTerms: application.data.approveTerms,
        companyName: application.data.companyName,
        companyDisplayName: application.data.companyDisplayName,
      },
    }
  }
}

const resolver = new ApplicationResolver()
export default {
  Mutation: {
    createApplication: resolver.createApplication,
  },
}
