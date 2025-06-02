import { PrismaClient, Prisma } from "@prisma/client"

import { UserModel } from "../domain/models/user.model.js"

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<UserModel | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        organizations: true,
      },
    })
  }

  async findById(id: string): Promise<UserModel | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        organizations: true,
      },
    })
  }

  async create(data: Prisma.UserCreateInput): Promise<UserModel> {
    return this.prisma.user.create({
      data,
      include: {
        organizations: true,
      },
    })
  }
}
