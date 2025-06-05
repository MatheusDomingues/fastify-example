import { z } from 'zod'

export const createApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export const apiKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  organizationId: z.string(),
})

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>
export type ApiKeyDtoSchema = z.infer<typeof apiKeySchema>
