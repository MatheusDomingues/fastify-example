import { PrismaClient, Prisma } from '@prisma/client'

export function InstanceRepository(prisma: PrismaClient) {
  return {
    create: (data: Prisma.InstanceCreateInput) => {
      return prisma.instance.create({ data })
    },

    findAll: () => {
      return prisma.instance.findMany()
    },

    findById: (id: string) => {
      return prisma.instance.findUnique({ where: { id } })
    },

    update: (id: string, data: Prisma.InstanceUpdateInput) => {
      return prisma.instance.update({
        where: { id },
        data,
      })
    },

    delete: (id: string) => {
      return prisma.instance.delete({ where: { id } })
    },
  }
}
