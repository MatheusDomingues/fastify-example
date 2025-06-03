import { z } from 'zod'

export const createInstanceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  number: z.string().min(1, 'Number is required'),
})

export const updateInstanceSchema = z.object({
  name: z.string().optional(),
  number: z.string().optional(),
  status: z.enum(['CONNECTED', 'DISCONNECTED', 'CONNECTING']).optional(),
})

export const instanceResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  number: z.string(),
  status: z.enum(['CONNECTED', 'DISCONNECTED', 'CONNECTING']),
  token: z.string(),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CreateInstanceInput = z.infer<typeof createInstanceSchema>
export type UpdateInstanceInput = z.infer<typeof updateInstanceSchema>
export type InstanceResponse = z.infer<typeof instanceResponseSchema>
