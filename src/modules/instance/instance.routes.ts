import { z } from 'zod'

import { InstanceController } from './instance.controller.js'
import { createInstanceSchema, updateInstanceSchema } from './instance.schema.js'
import { idParamsSchema } from '../../shared/utils/zodUtils.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'

export async function instanceRoutes(app: FastifyTypedInstance) {
  const controller = InstanceController(app.prisma)

  app.post(
    '/instances',
    {
      preValidation: app.authenticate,
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
      preValidation: app.authenticate,
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
      preValidation: app.authenticate,
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
      preValidation: app.authenticate,
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
      preValidation: app.authenticate,
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
