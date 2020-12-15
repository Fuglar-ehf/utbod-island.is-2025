import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
} from '@island.is/application/core'
import * as z from 'zod'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const dataSchema = z.object({
  personalInfo: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    phoneNumber: z.string().min(7),
    email: z.string().email().nonempty(),
    otherEmail: z.string().email().nonempty(),
    height: z.string().nonempty(),
  }),
  service: z.object({
    type: z.enum(['regular', 'express']),
    comment: z.string(),
    dropLocation: z.enum(['1', '2', '3']),
    extraOptions: z
      .array(z.union([z.enum(['bringOwnPhoto']), z.undefined()]))
      .nonempty(),
  }),
  timeSchedule: z.object({
    location: z.enum(['1', '2', '3']),
  }),
  approveExternalData: z.boolean().refine((v) => v),
})

const PassportTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PASSPORT,
  name: 'Umsókn um vegabréf',
  dataSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Umsókn um vegabréf',
          progress: 0.33,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/Draft').then((val) =>
                  Promise.resolve(val.Draft),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: 'approved',
          },
        },
      },
      approved: {
        meta: {
          name: 'Approved',
          progress: 1,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(id: string, application: Application): ApplicationRole {
    return 'applicant'
  },
}

export default PassportTemplate
