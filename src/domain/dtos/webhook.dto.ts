import { Prisma } from '@prisma/client'

import { InstanceDto } from './instance.dto.js'
import { WebhookDtoSchema } from '../../modules/webhook/webhook.schema.js'
import { WebhookModel } from '../models/webhook.model.js'

export function WebhookDto(
  data: WebhookModel,
  enabled?: boolean,
  payload?: Prisma.JsonValue,
  headers?: Prisma.JsonValue,
  urlTest?: string,
  events?: string[]
): WebhookDtoSchema {
  return {
    ...data,
    payload: payload,
    headers: headers,
    urlTest: urlTest,
    events: events,
    isEnabledForInstance: enabled,
    instances: data?.instances?.map(instance => InstanceDto(instance?.instance)),
  }
}
