import { Redis } from "ioredis"

import { ValidateCodeInput } from "../../../domain/schemas/auth.schema.js"
import { ResponseError } from "../../../shared/utils/response-error.js"

export class ValidateCodeUseCase {
  constructor(private redis: Redis) {}

  async execute(request: ValidateCodeInput): Promise<string> {
    const code = await this.redis.get(`forgot-password:${request.email}`)
    if (!code) throw new ResponseError(400, "Code expired")
    if (code !== request.code) throw new ResponseError(400, "Invalid code")

    await this.redis.set(`forgot-password:${request.email}`, "VALIDATED")

    return "Código validado com sucesso"
  }
}
