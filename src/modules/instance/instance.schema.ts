import { z } from 'zod'

import { webhookSchema } from '../webhook/webhook.schema.js'

export const createInstanceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  number: z.string().min(1, 'Number is required'),
  metadata: z.object({}).optional(),
  messageDelayMin: z.number().optional(),
  messageDelayMax: z.number().optional(),
  simulateTyping: z.boolean().optional(),
  readMessagesAutomatically: z.boolean().optional(),
  deleteMessageAfterSend: z.boolean().optional(),
  manageReceivedCalls: z.enum(['NEVER', 'AUDIO_ONLY', 'VIDEO_ONLY']).optional(),
  statusVisibility: z.enum(['TYPING', 'ONLINE', 'OFFLINE']).optional(),
})

export const updateInstanceSchema = z.object({
  name: z.string().optional(),
  number: z.string().optional(),
  status: z.enum(['CONNECTED', 'DISCONNECTED', 'CONNECTING']).optional(),
  metadata: z.object({}).optional(),
  messageDelayMin: z.number().optional(),
  messageDelayMax: z.number().optional(),
  simulateTyping: z.boolean().optional(),
  readMessagesAutomatically: z.boolean().optional(),
  deleteMessageAfterSend: z.boolean().optional(),
  manageReceivedCalls: z.enum(['NEVER', 'AUDIO_ONLY', 'VIDEO_ONLY']).optional(),
  statusVisibility: z.enum(['TYPING', 'ONLINE', 'OFFLINE']).optional(),
})

export const instanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  number: z.string(),
  status: z.enum(['CONNECTED', 'DISCONNECTED', 'CONNECTING']),
  organizationId: z.string(),
  metadata: z.object({}).optional(),
  profileName: z.string().optional(),
  imageUrl: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  messageDelayMin: z.number().optional(),
  messageDelayMax: z.number().optional(),
  simulateTyping: z.boolean().optional(),
  readMessagesAutomatically: z.boolean().optional(),
  deleteMessageAfterSend: z.boolean().optional(),
  manageReceivedCalls: z.enum(['NEVER', 'AUDIO_ONLY', 'VIDEO_ONLY']).optional(),
  statusVisibility: z.enum(['TYPING', 'ONLINE', 'OFFLINE']).optional(),
  webhooks: z.array(z.lazy(() => webhookSchema.omit({ instances: true }))).optional(),
})

export type CreateInstanceInput = z.infer<typeof createInstanceSchema>
export type UpdateInstanceInput = z.infer<typeof updateInstanceSchema>
export type InstanceDtoSchema = z.infer<typeof instanceSchema>
