import { z } from 'zod'

import { ApiKeyController } from './api-key.controller.js'
import { createApiKeySchema, apiKeySchema } from './api-key.schema.js'
import { idParamsSchema } from '../../shared/utils/zodUtils.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'

export async function apiKeyRoutes(app: FastifyTypedInstance) {
  const controller = ApiKeyController(app)

  app.post(
    '',
    {
      preValidation: app.authenticate,
      schema: {
        tags: ['ApiKey'],
        summary: 'Create a new api-key',
        body: createApiKeySchema,
        response: {
          201: apiKeySchema,
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.create
  )

  app.get(
    '',
    {
      preValidation: app.authenticate,
      schema: {
        tags: ['ApiKey'],
        summary: 'Get all api-keys',
        response: {
          200: z.array(apiKeySchema),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.findAll
  )

  app.delete(
    '/:id',
    {
      preValidation: app.authenticate,
      schema: {
        tags: ['ApiKey'],
        summary: 'Delete an api-key by id',
        params: idParamsSchema,
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.delete
  )
}
