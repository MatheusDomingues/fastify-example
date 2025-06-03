import { FastifyReply, FastifyRequest } from "fastify"

import { LoginUseCase } from "./use-cases/login.use-case.js"
import { RegisterUseCase } from "./use-cases/register.use-case.js"
import { ResetPasswordUseCase } from "./use-cases/reset-password.use-case.js"
import { ValidateCodeUseCase } from "./use-cases/validate-code.use-case.js"
import { UserDto } from "../../domain/dtos/user.dto.js"
import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  ValidateCodeInput,
} from "../../domain/schemas/auth.schema.js"
import { ResponseError } from "../../shared/utils/response-error.js"
import { FastifyTypedInstance } from "../../types/fastifyTypedInstance.js"
import { OrganizationRepository } from "../organization/organization.repository.js"
import { UserRepository } from "../user/user.repository.js"
import { ForgotPasswordUseCase } from "./use-cases/forgot-password.use-case.js"
import { MailService } from "../../shared/services/mail.service.js"

export class AuthController {
  private registerUseCase: RegisterUseCase
  private loginUseCase: LoginUseCase
  private forgotPasswordUseCase: ForgotPasswordUseCase
  private validateCodeUseCase: ValidateCodeUseCase
  private resetPasswordUseCase: ResetPasswordUseCase

  constructor(
    private prisma: FastifyTypedInstance["prisma"],
    private redis: FastifyTypedInstance["redis"]
  ) {
    const userRepository = new UserRepository(prisma)
    const organizationRepository = new OrganizationRepository(prisma)
    const mailService = new MailService()

    this.registerUseCase = new RegisterUseCase(userRepository, organizationRepository)
    this.loginUseCase = new LoginUseCase(prisma)
    this.forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, mailService, redis)
    this.validateCodeUseCase = new ValidateCodeUseCase(redis)
    this.resetPasswordUseCase = new ResetPasswordUseCase(userRepository, redis)
  }

  async register(request: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) {
    try {
      const response = await this.registerUseCase.execute(request.body)

      return reply.code(201).send({ message: response })
    } catch (error) {
      if (error instanceof ResponseError) {
        return reply.code(error.statusCode).send({ message: error.message })
      }

      reply.log.error(error)
      return reply.code(500).send({ message: "Internal server error" })
    }
  }

  async login(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
    try {
      const user = await this.loginUseCase.execute(request.body)

      reply.code(200).send(new UserDto(user))
    } catch (error) {
      if (error instanceof ResponseError) {
        reply.status(error.statusCode).send({ message: error.message })
      }

      reply.log.error(error)
      return reply.code(500).send("Internal server error")
    }
  }

  async forgotPassword(request: FastifyRequest<{ Body: ForgotPasswordInput }>, reply: FastifyReply) {
    try {
      const response = await this.forgotPasswordUseCase.execute(request.body)

      return reply.code(200).send({ message: response })
    } catch (error) {
      if (error instanceof ResponseError) {
        return reply.code(error.statusCode).send({ message: error.message })
      }

      reply.log.error(error)
      return reply.code(500).send({ message: "Internal server error" })
    }
  }

  async validateCode(request: FastifyRequest<{ Body: ValidateCodeInput }>, reply: FastifyReply) {
    try {
      const response = await this.validateCodeUseCase.execute(request.body)

      return reply.code(200).send({ message: response })
    } catch (error) {
      if (error instanceof ResponseError) {
        return reply.code(error.statusCode).send({ message: error.message })
      }

      reply.log.error(error)
      return reply.code(500).send({ message: "Internal server error" })
    }
  }

  async resetPassword(request: FastifyRequest<{ Body: ResetPasswordInput }>, reply: FastifyReply) {
    try {
      const response = await this.resetPasswordUseCase.execute(request.body)

      return reply.code(200).send({ message: response })
    } catch (error) {
      if (error instanceof ResponseError) {
        return reply.code(error.statusCode).send({ message: error.message })
      }

      reply.log.error(error)
      return reply.code(500).send({ message: "Internal server error" })
    }
  }
}
