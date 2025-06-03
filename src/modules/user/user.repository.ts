import { PrismaClient, Prisma } from '@prisma/client'

import { UserModel } from '../../domain/models/user.model.js'

export function UserRepository(prisma: PrismaClient) {
  return {
    findByEmail: async (email: string): Promise<UserModel | null> => {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          organizations: {
            include: {
              organization: true,
            },
          },
        },
      })
    },

    findById: async (id: string): Promise<UserModel | null> => {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          organizations: {
            include: {
              organization: true,
            },
          },
        },
      })
    },

    create: async (data: Prisma.UserCreateInput): Promise<UserModel> => {
      return await prisma.user.create({
        data,
        include: {
          organizations: {
            include: {
              organization: true,
            },
          },
        },
      })
    },

    update: async (id: string, data: Prisma.UserUpdateInput): Promise<UserModel | null> => {
      return await prisma.user.update({
        where: { id },
        data,
        include: {
          organizations: {
            include: {
              organization: true,
            },
          },
        },
      })
    },
  }
}
