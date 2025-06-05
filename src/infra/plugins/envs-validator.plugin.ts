import fastifyEnv from '@fastify/env'
import fp from 'fastify-plugin'

import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'

export const envsValidatorPlugin = fp(async (app: FastifyTypedInstance) => {
  app.register(fastifyEnv, {
    schema: {
      type: 'object',
      required: ['POSTGRES_URL', 'REDIS_URL', 'RESEND_API_KEY', 'JWT_SECRET', 'JWT_EXPIRES_IN'],
      properties: {
        PORT: { type: 'string' },
        NODE_ENV: { type: 'string' },
        POSTGRES_URL: { type: 'string' },
        REDIS_URL: { type: 'string' },
        RESEND_API_KEY: { type: 'string' },
        JWT_SECRET: { type: 'string' },
        JWT_EXPIRES_IN: { type: 'string' },
      },
    },
    dotenv: true,
    data: process.env,
  })
})
