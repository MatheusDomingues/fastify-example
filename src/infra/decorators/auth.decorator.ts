import fp from 'fastify-plugin'

import { ApiKeyRepository } from '../../modules/api-key/api-key.repository.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'

export const authDecorator = fp(async (app: FastifyTypedInstance) => {
  const apiKeyRepository = ApiKeyRepository(app.prisma)

  app.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()
      return
    } catch {
      app.log.debug('JWT invalid or missing. Trying API Key authentication...')
    }

    const apiKeyHeader = request.headers['x-api-key'] as string | undefined
    if (!apiKeyHeader) {
      return reply.status(401).send({ error: 'Unauthorized: API Key missing' })
    }

    const apiKey = await apiKeyRepository.findByKey(apiKeyHeader)
    if (!apiKey) {
      return reply.status(401).send({ error: 'Unauthorized: Invalid API Key' })
    }

    request.user = {
      organizationId: apiKey.organizationId,
      apiKeyId: apiKey.id,
      type: 'apiKey',
    }
  })
})
