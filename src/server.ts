import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { bullMQPlugin } from './infra/plugins/bullmq.plugin.js'
import { jwtPlugin } from './infra/plugins/jwt.plugin.js'
import { mailPlugin } from './infra/plugins/mail.plugin.js'
import { prismaPlugin } from './infra/plugins/prisma.plugin.js'
import { redisPlugin } from './infra/plugins/redis.plugin.js'
import { authRoutes } from './modules/auth/auth.routes.js'
import { instanceRoutes } from './modules/instance/instance.routes.js'

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:dd-mm-yyyy HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

// Validators
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Plugins
app.register(fastifyCors, { origin: '*' })
app.register(prismaPlugin)
app.register(redisPlugin)
app.register(mailPlugin)
app.register(jwtPlugin)
app.register(bullMQPlugin)

// Swagger
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API Linkify',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${Number(process.env.PORT) || 5000}`,
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// Routes
app.register(authRoutes, { prefix: '/api/auth' })
app.register(instanceRoutes, { prefix: '/api/instances' })
app.register(() => {
  app.get(
    '/api/healthz',
    {
      schema: {
        tags: ['Health-Check'],
        summary: 'Checa se o servidor está online',
        response: { 200: z.string() },
      },
    },
    async (_, reply) => {
      reply.code(200).send('OK')
    }
  )
})

// Listen
app.listen({ port: Number(process.env.PORT) || 5000 })
