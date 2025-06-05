import { Job, Queue, QueueOptions, Worker, WorkerOptions } from 'bullmq'
import fp from 'fastify-plugin'

export const bullMQPlugin = fp(async app => {
  app.decorate('queues', {
    send: async <T = any>(queueName: string, jobName: string, data: T, options?: Partial<QueueOptions>) => {
      const queues = new Queue(queueName, { connection: app.redis, prefix: 'linkify-bull', ...options })

      return (await queues.add(jobName, data)) as Job<T>
    },
    get: async <T = any>(queueName: string, jobId: string) => {
      const queues = new Queue(queueName, { connection: app.redis, prefix: 'linkify-bull' })

      return (await queues.getJob(jobId)) as Job<T> | null
    },
    remove: async (queueName: string, jobId: string, removeChildren: boolean = true) => {
      const queues = new Queue(queueName, { connection: app.redis, prefix: 'linkify-bull' })

      return await queues.remove(jobId, { removeChildren })
    },
  })

  app.decorate(
    'worker',
    <T = any>(queueName: string, handler: (job: Job<T>) => Promise<void>, options?: Partial<WorkerOptions>) => {
      return new Worker(queueName, handler, {
        connection: { ...app.redis.options, maxRetriesPerRequest: null },
        prefix: 'linkify-bull',
        ...options,
      }) as Worker<T>
    }
  )
})
