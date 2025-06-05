import { z } from 'zod'

import { AuthController } from './auth.controller.js'
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  validateCodeSchema,
} from './auth.schema.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'
import { userDtoSchema } from '../user/user.schema.js'

export async function authRoutes(app: FastifyTypedInstance) {
  const controller = AuthController(app)

  app.post(
    '/register',
    {
      schema: {
        security: [],
        tags: ['Auth'],
        summary: 'Register a new user',
        description: 'Register a new user and create an organization',
        body: registerSchema,
        response: {
          201: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.register
  )

  app.post(
    '/login',
    {
      schema: {
        security: [],
        tags: ['Auth'],
        summary: 'Login a user',
        description: 'Login a user and return a token',
        body: loginSchema,
        response: {
          200: userDtoSchema,
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.login
  )

  app.post(
    '/forgot-password',
    {
      schema: {
        security: [],
        tags: ['Auth'],
        summary: 'Forgot password',
        description: "Send a code to the user's email to reset their password",
        body: forgotPasswordSchema,
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.forgotPassword
  )

  app.post(
    '/validate-code',
    {
      schema: {
        security: [],
        tags: ['Auth'],
        summary: 'Validate code to reset password',
        description: "Validate a code to reset a user's password",
        body: validateCodeSchema,
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.validateCode
  )

  app.post(
    '/reset-password',
    {
      schema: {
        security: [],
        tags: ['Auth'],
        summary: 'Reset password',
        description: "Reset a user's password",
        body: resetPasswordSchema,
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    controller.resetPassword
  )
}
