import { Prisma } from '@prisma/client'

import { InstanceModel } from './instance.model.js'

export type WebhookModel = {
  id: string
  createdAt: Date
  updatedAt: Date
  instanceId: string
  enabled: boolean
  payload?: Prisma.JsonValue
  headers?: Prisma.JsonValue
  events?: string[]
  instance?: InstanceModel
}
