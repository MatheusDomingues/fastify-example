import { FastifyReply, FastifyRequest } from 'fastify'

import { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput, ValidateCodeInput } from './auth.schema.js'
import { AuthService } from './auth.service.js'
import { UserDto } from '../../domain/dtos/user.dto.js'
import { handleError } from '../../shared/utils/handle-error.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'
import { OrganizationRepository } from '../organization/organization.repository.js'
import { UserRepository } from '../user/user.repository.js'

export function AuthController(app: FastifyTypedInstance) {
  const userRepository = UserRepository(app.prisma)
  const organizationRepository = OrganizationRepository(app.prisma)

  const authService = AuthService(app.redis, app.mail, userRepository, organizationRepository)

  return {
    register: async (request: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) => {
      try {
        const response = await authService.register(request.body)

        return reply.code(201).send({ message: response })
      } catch (error) {
        handleError(error, reply)
      }
    },

    login: async (request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) => {
      try {
        const user = await authService.login(request.body)

        const organizationId = user.organizations[0]?.organization?.id
        const token = app.jwt.sign({
          sub: user.id,
          name: user.name,
          email: user.email,
          organizationId: organizationId,
        })

        reply.code(200).send(UserDto(user, token, organizationId))
      } catch (error) {
        handleError(error, reply)
      }
    },

    forgotPassword: async (request: FastifyRequest<{ Body: ForgotPasswordInput }>, reply: FastifyReply) => {
      try {
        const response = await authService.forgotPassword(request.body)

        return reply.code(200).send({ message: response })
      } catch (error) {
        handleError(error, reply)
      }
    },

    validateCode: async (request: FastifyRequest<{ Body: ValidateCodeInput }>, reply: FastifyReply) => {
      try {
        const response = await authService.validateCode(request.body)

        return reply.code(200).send({ message: response })
      } catch (error) {
        handleError(error, reply)
      }
    },

    resetPassword: async (request: FastifyRequest<{ Body: ResetPasswordInput }>, reply: FastifyReply) => {
      try {
        const response = await authService.resetPassword(request.body)

        return reply.code(200).send({ message: response })
      } catch (error) {
        handleError(error, reply)
      }
    },
  }
}
