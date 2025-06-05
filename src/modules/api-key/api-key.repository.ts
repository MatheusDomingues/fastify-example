import { PrismaClient, Prisma } from '@prisma/client'

export function ApiKeyRepository(prisma: PrismaClient) {
  return {
    create: async (data: Prisma.ApiKeyCreateInput | Prisma.ApiKeyUncheckedCreateInput) => {
      return await prisma.apiKey.create({
        data,
      })
    },

    findAll: async (where: Prisma.ApiKeyWhereInput) => {
      return await prisma.apiKey.findMany({
        where,
      })
    },

    findById: async (id: string) => {
      return await prisma.apiKey.findUnique({
        where: { id },
      })
    },

    findByKey: async (key: string) => {
      return await prisma.apiKey.findUnique({
        where: { key },
      })
    },

    delete: async (id: string) => {
      return await prisma.apiKey.delete({
        where: { id },
      })
    },
  }
}
