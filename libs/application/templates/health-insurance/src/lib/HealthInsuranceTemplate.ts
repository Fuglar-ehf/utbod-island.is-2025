import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
} from '@island.is/application/core'
import * as z from 'zod'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const HealthInsuranceSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    address: z.string().nonempty(),
    postalCode: z.string().min(3).max(3),
    city: z.string().nonempty(),
    nationality: z.string().nonempty(),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
  }),
  status: z.string().nonempty(),
  confirmationOfStudies: z.string().optional(),
  children: z.string().nonempty(),
  formerInsuranceRegistration: z.string().nonempty(),
  formerInsuranceCountry: z.string().nonempty(),
  formerPersonalId: z.string().nonempty(),
  formerInsuranceInstitution: z.string().nonempty(),
  formerInsuranceEntitlement: z.string().nonempty(),
  additionalInfo: z.string().nonempty(),
  additionalRemarks: z.string().optional(),
  additionalFiles: z.string().optional(),
  confirmCorrectInfo: z.boolean().refine((v) => v),
})

const HealthInsuranceTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.HEALTH_INSURANCE,
  name: 'Application for health insurance',
  dataSchema: HealthInsuranceSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'draft',
          progress: 0.25,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/HealthInsuranceForm').then((module) =>
                  Promise.resolve(module.HealthInsuranceForm),
                ),
              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' }],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: 'inReview',
          },
        },
      },
      inReview: {
        meta: {
          name: 'inReview',
          progress: 0.5,
          roles: [
            {
              id: 'applicant',
              actions: [
                { event: 'APPROVE', name: 'Approve', type: 'primary' },
                { event: 'REJECT', name: 'Reject', type: 'reject' },
              ],
              write: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(id: string, state: string): ApplicationRole {
    if (state === 'inReview') {
      return 'reviewer'
    }
    return 'applicant'
  },
}

export default HealthInsuranceTemplate
