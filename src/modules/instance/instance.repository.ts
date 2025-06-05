import { PrismaClient, Prisma } from '@prisma/client'

export function InstanceRepository(prisma: PrismaClient) {
  return {
    create: async (data: Prisma.InstanceCreateInput | Prisma.InstanceUncheckedCreateInput) => {
      return await prisma.instance.create({
        data,
        include: {
          webhooks: {
            include: {
              webhook: true,
            },
          },
        },
      })
    },

    findAll: async (where: Prisma.InstanceWhereInput) => {
      return await prisma.instance.findMany({
        where,
        include: {
          webhooks: {
            include: {
              webhook: true,
            },
          },
        },
      })
    },

    findById: async (id: string) => {
      return await prisma.instance.findUnique({
        where: { id },
        include: {
          webhooks: {
            include: {
              webhook: true,
            },
          },
        },
      })
    },

    update: async (id: string, data: Prisma.InstanceUpdateInput | Prisma.InstanceUncheckedUpdateInput) => {
      return await prisma.instance.update({
        where: { id },
        data,
        include: {
          webhooks: {
            include: {
              webhook: true,
            },
          },
        },
      })
    },

    delete: async (id: string) => {
      return await prisma.instance.delete({
        where: { id },
        include: {
          webhooks: {
            include: {
              webhook: true,
            },
          },
        },
      })
    },
  }
}
