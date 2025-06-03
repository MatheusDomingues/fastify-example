import fastifyRedis from '@fastify/redis'
import fp from 'fastify-plugin'

export const redisPlugin = fp(async app => {
  await app.register(fastifyRedis, {
    url: process.env.REDIS_URL,
  })

  app.log.info('Redis connected!')
})
