import { randomBytes } from 'crypto'

import { ApiKeyRepository } from './api-key.repository.js'
import { CreateApiKeyInput } from './api-key.schema.js'
import { ResponseError } from '../../shared/utils/response-error.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'

export function ApiKeyService(apiKeyRepository: ReturnType<typeof ApiKeyRepository>) {
  return {
    create: async (data: CreateApiKeyInput, user: FastifyTypedInstance['user']) => {
      const key = `lkf-${randomBytes(32).toString('hex')}`

      const apiKey = await apiKeyRepository.create({
        key,
        name: data.name,
        organizationId: user.organizationId,
      })

      if (!apiKey) throw new ResponseError(500, 'Api Key not created')

      return apiKey
    },

    findAll: async (user: FastifyTypedInstance['user']) => {
      const apiKeys = await apiKeyRepository.findAll({
        organizationId: user.organizationId,
      })

      return apiKeys
    },

    delete: async (id: string, user: FastifyTypedInstance['user']) => {
      const apiKey = await apiKeyRepository.findById(id)

      if (!apiKey) throw new ResponseError(404, 'ApiKey not found')
      if (apiKey.organizationId !== user.organizationId) throw new ResponseError(401, 'User not authorized')

      await apiKeyRepository.delete(id)

      return 'Api Key deleted successfully'
    },
  }
}
