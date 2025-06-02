import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

import { UserModel } from "../../domain/models/user.model.js"
import { LoginInput } from "../../domain/schemas/auth.schema.js"
import { ResponseError } from "../../utils/response-error.js"

export class LoginUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: LoginInput): Promise<UserModel> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) throw new ResponseError(401, "User not found")
    if (!user?.password) throw new ResponseError(401, "Other method used")

    const isPasswordsMatch = await bcrypt.compare(data.password, user.password)
    if (!isPasswordsMatch) throw new ResponseError(401, "Wrong email or password")

    return user
  }
}
