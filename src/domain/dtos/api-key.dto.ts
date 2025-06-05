import { ApiKeyDtoSchema } from '../../modules/api-key/api-key.schema.js'
import { ApiKeyModel } from '../models/api-key.model.js'

export function ApiKeyDto(data: ApiKeyModel, showApiKey?: boolean): ApiKeyDtoSchema {
  return {
    id: data?.id,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
    name: data?.name,
    key: showApiKey ? data?.key : data?.key?.slice(0, 10) + '•••••••••••••••••••',
    organizationId: data?.organizationId,
  }
}
