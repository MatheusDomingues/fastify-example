import { WebhookDto } from './webhook.dto.js'
import { InstanceModel } from '../models/instance.model.js'

export function InstanceDto(data: InstanceModel) {
  return {
    id: data?.id,
    name: data?.name,
    number: data?.number,
    status: data?.status,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
    metadata: data?.metadata,
    profileName: data?.profileName,
    imageUrl: data?.imageUrl,
    readMessagesAutomatically: data?.readMessagesAutomatically,
    messageDelayMin: data?.messageDelayMin,
    messageDelayMax: data?.messageDelayMax,
    simulateTyping: data?.simulateTyping,
    deleteMessageAfterSend: data?.deleteMessageAfterSend,
    manageReceivedCalls: data?.manageReceivedCalls,
    statusVisibility: data?.statusVisibility,
    organizationId: data?.organizationId,
    userId: data?.userId,
    webhooks: data?.webhooks?.map(webhook =>
      WebhookDto(
        webhook?.webhook,
        webhook?.enabled,
        webhook?.payload,
        webhook?.headers,
        webhook?.urlTest,
        webhook?.events
      )
    ),
  }
}
