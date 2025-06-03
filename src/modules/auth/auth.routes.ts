import { FastifyInstance } from "fastify"
import { z } from "zod"

import { AuthController } from "./auth.controller.js"
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  validateCodeSchema,
} from "../../domain/schemas/auth.schema.js"
import { userDtoSchema } from "../../domain/schemas/user.schema.js"

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController(app.prisma, app.redis)

  app.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Register a new user and create an organization",
        body: registerSchema,
        response: {
          201: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
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
        description: "Login a user and return a token",
        body: loginSchema,
        response: {
          200: userDtoSchema,
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.login.bind(controller)
  )

  app.post(
    "/forgot-password",
    {
      schema: {
        tags: ["Auth"],
        summary: "Forgot password",
        description: "Send a code to the user's email to reset their password",
        body: forgotPasswordSchema,
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.forgotPassword.bind(controller)
  )

  app.post(
    "/validate-code",
    {
      schema: {
        tags: ["Auth"],
        summary: "Validate code to reset password",
        description: "Validate a code to reset a user's password",
        body: validateCodeSchema,
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.validateCode.bind(controller)
  )

  app.post(
    "/reset-password",
    {
      schema: {
        tags: ["Auth"],
        summary: "Reset password",
        description: "Reset a user's password",
        body: resetPasswordSchema,
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.resetPassword.bind(controller)
  )
}
