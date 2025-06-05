import { Prisma } from '@prisma/client'

import { InstanceModel } from './instance.model.js'
import { WebhookModel } from './webhook.model.js'

export type InstanceWebhookModel = {
  id: number
  createdAt: Date
  updatedAt: Date
  enabled: boolean
  payload?: Prisma.JsonValue
  headers?: Prisma.JsonValue
  urlTest?: string
  events: string[]
  instanceId: string
  webhookId: string
  instance?: InstanceModel
  webhook?: WebhookModel
}
