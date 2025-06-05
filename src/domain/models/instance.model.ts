import { InstanceStatus, ManageReceivedCalls, Prisma, StatusVisibility } from '@prisma/client'

import { InstanceWebhookModel } from './instance-webhook.model.js'
import { OrganizationModel } from './organization.model.js'
import { UserModel } from './user.model.js'

export type InstanceModel = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  number: string
  status: InstanceStatus
  organizationId: string
  metadata?: Prisma.JsonValue
  profileName?: string
  imageUrl?: string
  userId?: string
  readMessagesAutomatically?: boolean
  messageDelayMin?: number
  messageDelayMax?: number
  simulateTyping?: boolean
  deleteMessageAfterSend?: boolean
  manageReceivedCalls?: ManageReceivedCalls
  statusVisibility?: StatusVisibility
  user?: UserModel
  organization?: OrganizationModel
  webhooks?: InstanceWebhookModel[]
}
