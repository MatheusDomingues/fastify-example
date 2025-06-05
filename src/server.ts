import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { authDecorator } from './infra/decorators/auth.decorator.js'
import { bootstrapPlugin } from './infra/plugins/bootstrap.plugin.js'
import { bullMQPlugin } from './infra/plugins/bullmq.plugin.js'
import { envsValidatorPlugin } from './infra/plugins/envs-validator.plugin.js'
import { jwtPlugin } from './infra/plugins/jwt.plugin.js'
import { mailPlugin } from './infra/plugins/mail.plugin.js'
import { prismaPlugin } from './infra/plugins/prisma.plugin.js'
import { redisPlugin } from './infra/plugins/redis.plugin.js'
import { apiKeyRoutes } from './modules/api-key/api-key.routes.js'
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
app.register(envsValidatorPlugin)
app.register(prismaPlugin)
app.register(redisPlugin)
app.register(mailPlugin)
app.register(jwtPlugin)
app.register(bullMQPlugin)

// Decorators
app.register(authDecorator)

// Swagger
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API Linkify',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${Number(process.env.PORT) || 5000}/api/v1`,
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
app.register(authRoutes, { prefix: '/api/v1/auth' })
app.register(instanceRoutes, { prefix: '/api/v1/instances' })
app.register(apiKeyRoutes, { prefix: '/api/v1/api-keys' })

app.register(() => {
  app.get(
    '/api/v1/healthz',
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
async function start() {
  await app.register(bootstrapPlugin)
  await app.listen({ port: Number(process.env.PORT) || 5000 })
}

start().catch(err => {
  app.log.error(err, 'Erro ao iniciar o servidor')
  process.exit(1)
})
