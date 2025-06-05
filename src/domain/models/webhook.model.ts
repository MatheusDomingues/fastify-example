import { InstanceWebhookModel } from './instance-webhook.model.js'

export type WebhookModel = {
  id: string
  createdAt: Date
  updatedAt: Date
  url: string
  enabled: boolean
  instances?: InstanceWebhookModel[]
}
