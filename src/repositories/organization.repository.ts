import { PrismaClient, Prisma } from "@prisma/client"

import { OrganizationModel } from "../domain/models/organization.model.js"

export class OrganizationRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<OrganizationModel | null> {
    return this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: true,
      },
    })
  }

  async create(data: Prisma.OrganizationCreateInput): Promise<OrganizationModel> {
    return this.prisma.organization.create({
      data,
      include: {
        users: true,
      },
    })
  }
}
