import fastifyJwt from '@fastify/jwt'
import fp from 'fastify-plugin'

import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'

export const jwtPlugin = fp(async (app: FastifyTypedInstance) => {
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      algorithm: 'HS256',
      iss: 'linkify-api',
      aud: 'linkify-client',
      expiresIn: process.env.JWT_EXPIRES_IN || '6h',
    },
    verify: { algorithms: ['HS256'] },
  })
})
