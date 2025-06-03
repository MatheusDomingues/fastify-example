import { FastifyReply } from 'fastify'

import { ResponseError } from './response-error.js'

export function handleError(error: any, reply: FastifyReply) {
  reply.log.error(error)
  if (error instanceof ResponseError) {
    reply.code(error.statusCode).send({ message: error.message })
  } else {
    reply.code(500).send({ message: 'Internal server error' })
  }
}
