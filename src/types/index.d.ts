import 'fastify'
import { PrismaClient } from '@prisma/client'
import { WASocket } from '@whiskeysockets/baileys'
import Redis from 'ioredis'
import { Resend } from 'resend'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    redis: Redis
    mail: Resend
    createBaileysInstance: (instanceId: string) => Promise<WASocket>
  }
}
