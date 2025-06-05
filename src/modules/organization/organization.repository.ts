import { PrismaClient, Prisma } from '@prisma/client'

import { OrganizationModel } from '../../domain/models/organization.model.js'

export function OrganizationRepository(prisma: PrismaClient) {
  return {
    findById: async (id: string): Promise<OrganizationModel | null> => {
      return await prisma.organization.findUnique({
        where: { id },
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      })
    },

    create: async (
      data: Prisma.OrganizationCreateInput | Prisma.OrganizationUncheckedCreateInput
    ): Promise<OrganizationModel> => {
      return await prisma.organization.create({
        data,
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      })
    },
  }
}
