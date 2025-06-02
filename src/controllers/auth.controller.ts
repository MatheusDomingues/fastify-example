import { FastifyReply, FastifyRequest } from "fastify"

import { UserDto } from "../domain/dtos/user.dto.js"
import { LoginInput, RegisterInput } from "../domain/schemas/auth.schema.js"
import { OrganizationRepository } from "../repositories/organization.repository.js"
import { UserRepository } from "../repositories/user.repository.js"
import { FastifyTypedInstance } from "../types/fastifyTypedInstance.js"
import { LoginUseCase } from "../use-cases/auth/login.use-case.js"
import { RegisterUseCase } from "../use-cases/auth/register.use-case.js"
import { ResponseError } from "../utils/response-error.js"

export class AuthController {
  private registerUseCase: RegisterUseCase
  private loginUseCase: LoginUseCase

  constructor(private prisma: FastifyTypedInstance["prisma"]) {
    const userRepository = new UserRepository(prisma)
    const organizationRepository = new OrganizationRepository(prisma)

    this.registerUseCase = new RegisterUseCase(userRepository, organizationRepository)
    this.loginUseCase = new LoginUseCase(prisma)
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
}
