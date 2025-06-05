import { z } from 'zod'

import { instanceSchema } from '../instance/instance.schema.js'

export const webhookSchema = z.object({
  id: z.string(),
  url: z.string(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  payload: z.object({}).optional(),
  headers: z.object({}).optional(),
  urlTest: z.string().optional(),
  events: z.array(z.string()).optional(),
  isEnabledForInstance: z.boolean().optional(),
  instances: z.array(z.lazy(() => instanceSchema.omit({ webhooks: true }))).optional(),
})

export type WebhookDtoSchema = z.infer<typeof webhookSchema>
