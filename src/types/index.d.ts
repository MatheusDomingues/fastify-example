import 'fastify'
import { JWT } from '@fastify/jwt'
import { PrismaClient } from '@prisma/client'
import { WASocket } from '@whiskeysockets/baileys'
import Redis from 'ioredis'
import { Resend } from 'resend'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    redis: Redis
    mail: Resend
    jwt: JWT
    createBaileysInstance: (instanceId: string) => Promise<WASocket>
    authenticate: (
      request: FastifyRequest<{ Body: any; Params: any; Headers: any; Querystring: any }>,
      reply: FastifyReply
    ) => Promise<void>
  }
}
