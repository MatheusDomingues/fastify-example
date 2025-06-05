import fastifyJwt from '@fastify/jwt'
import fp from 'fastify-plugin'

import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'

export const jwtPlugin = fp(async (app: FastifyTypedInstance) => {
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
    sign: {
      expiresIn: '1h',
    },
  })

  // Decorar método de autenticação para proteger rotas
  app.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
})
