import bcrypt from "bcryptjs"

import { RegisterInput } from "../../../domain/schemas/auth.schema.js"
import { ResponseError } from "../../../shared/utils/response-error.js"
import { OrganizationRepository } from "../../organization/organization.repository.js"
import { UserRepository } from "../../user/user.repository.js"

export class RegisterUseCase {
  constructor(
    private userRepository: UserRepository,
    private organizationRepository: OrganizationRepository
  ) {}

  async execute(data: RegisterInput): Promise<string> {
    const { name, email, password, confirmPassword, organizationName } = data

    if (password !== confirmPassword) {
      throw new ResponseError(400, "Passwords do not match")
    }

    const userExists = await this.userRepository.findByEmail(email)
    if (userExists) {
      throw new ResponseError(400, "Email already in use")
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
    })

    await this.organizationRepository.create({
      name: organizationName,
      users: {
        create: {
          userId: user.id,
          email: user.email,
          status: "APPROVED",
        },
      },
    })

    return "User registered successfully"
  }
}
