import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { InstanceController } from './instance.controller.js'
import { createInstanceSchema, updateInstanceSchema } from './instance.schema.js'
import { idParamsSchema } from '../../shared/utils/zodUtils.js'

export async function instanceRoutes(app: FastifyInstance) {
  const controller = InstanceController(app.prisma)

  app.post(
    '/instances',
    {
      schema: {
        tags: ['Instances'],
        summary: 'Create a new instance',
        body: createInstanceSchema,
        response: {
          201: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.create
  )

  app.get(
    '/instances',
    {
      schema: {
        tags: ['Instances'],
        summary: 'Get all instances',
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.findAll
  )

  app.get(
    '/instances/:id',
    {
      schema: {
        tags: ['Instances'],
        summary: 'Get an instance by id',
        params: idParamsSchema,
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.findById
  )

  app.put(
    '/instances/:id',
    {
      schema: {
        tags: ['Instances'],
        summary: 'Update an instance by id',
        params: idParamsSchema,
        body: updateInstanceSchema,
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.update
  )

  app.delete(
    '/instances/:id',
    {
      schema: {
        tags: ['Instances'],
        summary: 'Delete an instance by id',
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
