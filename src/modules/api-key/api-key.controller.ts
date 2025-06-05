import { FastifyReply, FastifyRequest } from 'fastify'

import { ApiKeyRepository } from './api-key.repository.js'
import { CreateApiKeyInput } from './api-key.schema.js'
import { ApiKeyService } from './api-key.service.js'
import { ApiKeyDto } from '../../domain/dtos/api-key.dto.js'
import { handleError } from '../../shared/utils/handle-error.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'

export function ApiKeyController(app: FastifyTypedInstance) {
  const apiKeyRepository = ApiKeyRepository(app.prisma)
  const apiKeyService = ApiKeyService(apiKeyRepository)

  return {
    create: async (request: FastifyRequest<{ Body: CreateApiKeyInput }>, reply: FastifyReply) => {
      try {
        const apiKey = await apiKeyService.create(request.body, app.user)

        reply.code(201).send(ApiKeyDto(apiKey, true))
      } catch (error) {
        handleError(error, reply)
      }
    },

    findAll: async (_: FastifyRequest, reply: FastifyReply) => {
      try {
        const apiKeys = await apiKeyService.findAll(app.user)

        reply.code(200).send(apiKeys.map(apiKey => ApiKeyDto(apiKey)))
      } catch (error) {
        handleError(error, reply)
      }
    },

    delete: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        await apiKeyService.delete(request.params.id, app.user)

        reply.code(200).send({ message: 'ApiKey deleted' })
      } catch (error) {
        handleError(error, reply)
      }
    },
  }
}
