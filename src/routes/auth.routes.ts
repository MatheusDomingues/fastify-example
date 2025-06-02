import { FastifyInstance } from "fastify"
import { z } from "zod"

import { AuthController } from "../controllers/auth.controller.js"
import { loginSchema, registerSchema } from "../domain/schemas/auth.schema.js"
import { userDtoSchema } from "../domain/schemas/user.schema.js"

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController(app.prisma)

  app.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Register a new user",
        body: registerSchema,
        response: {
          201: z.object({ message: z.string() }),
        },
      },
    },
    controller.register.bind(controller)
  )

  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Login a user",
        body: loginSchema,
        response: {
          200: userDtoSchema,
        },
      },
    },
    controller.login.bind(controller)
  )
}
