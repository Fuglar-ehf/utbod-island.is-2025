import { z } from 'zod'

const Vehicles = z.object({
  make: z.string(),
  role: z.string(),
  color: z.string(),
  permno: z.string(),
  mileage: z.string().refine((m) => m !== '' && m !== '0'),
})

export const DataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  vehicles: z.object({
    selectedVehicles: z.array(Vehicles).refine((s) => s.length !== 0),
  }),
})

export type SchemaFormValues = z.infer<typeof DataSchema>
