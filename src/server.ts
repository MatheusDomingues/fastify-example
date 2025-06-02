import { fastifyCors } from "@fastify/cors"
import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { fastify } from "fastify"
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod"
import { z } from "zod"

import { prismaPlugin } from "./plugins/prisma.plugin.js"
import { authRoutes } from "./routes/auth.routes.js"

const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:dd-mm-yyyy HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, { origin: "*" })
app.register(prismaPlugin)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API Linkify",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${Number(process.env.PORT) || 3333}`,
        description: "Servidor local",
      },
    ],
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
})

app.register(() => {
  app.get(
    "/healthz",
    {
      schema: {
        tags: ["Healthcheck"],
        summary: "Checa se o servidor está online",
        response: { 200: z.string() },
      },
    },
    async (_, reply) => {
      reply.code(200).send("OK")
    }
  )
})
app.register(authRoutes)

// listen
app.listen({ port: Number(process.env.PORT) || 3333 })
