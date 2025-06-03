import bcrypt from "bcryptjs"
import { Redis } from "ioredis"

import { ResetPasswordInput } from "../../../domain/schemas/auth.schema.js"
import { ResponseError } from "../../../shared/utils/response-error.js"
import { UserRepository } from "../../user/user.repository.js"

export class ResetPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private redis: Redis
  ) {}

  async execute(request: ResetPasswordInput): Promise<string> {
    let user = await this.userRepository.findByEmail(request.email)
    if (!user) throw new ResponseError(400, "Email not found")

    const code = await this.redis.get(`forgot-password:${request.email}`)
    if (code !== "VALIDATED") throw new ResponseError(400, "Code not validated")

    if (request.password !== request.confirmPassword) throw new ResponseError(400, "Passwords do not match")

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(request.password, salt)

    user = await this.userRepository.update(user.id, { password })
    if (!user) throw new ResponseError(500, "User was not updated")

    await this.redis.del(`forgot-password:${request.email}`)

    return "Senha atualizada com sucesso"
  }
}
