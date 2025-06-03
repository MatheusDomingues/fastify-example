import { InstanceStatus, Prisma } from '@prisma/client'

import { OrganizationModel } from './organization.model.js'
import { UserModel } from './user.model.js'
import { WebhookModel } from './webhook.model.js'

export type InstanceModel = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  number: string
  status: InstanceStatus
  organizationId: string
  organization: OrganizationModel
  metadata?: Prisma.JsonValue
  profileName?: string
  userId?: string
  user?: UserModel
  webhooks?: WebhookModel[]
}
