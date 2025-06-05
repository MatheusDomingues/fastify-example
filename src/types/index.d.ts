import 'fastify'
import { JWT } from '@fastify/jwt'
import { PrismaClient } from '@prisma/client'
import { QueueOptions, WorkerOptions } from 'bullmq'
import Redis from 'ioredis'
import { Resend } from 'resend'

import { BaileysRepository } from '../modules/baileys/baileys.repository.ts'

interface Queues {
  send: <T = any>(
    queueName: string,
    jobName: string,
    data: T,
    options?: Partial<QueueOptions>
  ) => Promise<Job<T, any, string>>
  get: <T = any>(queueName: string, jobId: string) => Promise<Job<T, any, string> | null>
  remove: (queueName: string, jobId: string, removeChildren: boolean = true) => Promise<number>
}

type WorkerHandler<T = any> = (job: Job<T, any, string>) => Promise<void>
interface WorkerFactory {
  <T = any>(queueName: string, handler: WorkerHandler<T>, options?: Partial<WorkerOptions>): Worker<T>
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    redis: Redis
    mail: Resend
    jwt: JWT
    queues: Queues
    baileysRepository: ReturnType<typeof BaileysRepository>
    worker: WorkerFactory
    authenticate: (
      request: FastifyRequest<{ Body: any; Params: any; Headers: any; Querystring: any }>,
      reply: FastifyReply
    ) => Promise<void>
    user?: {
      sub?: string
      email?: string
      name?: string
      organizationId: string
      apiKeyId?: string
      type: 'user' | 'apiKey'
      [key: string]: any
    }
  }
}
