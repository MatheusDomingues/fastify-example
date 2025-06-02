import { PrismaClient } from "@prisma/client"
import fp from "fastify-plugin"

export const prismaPlugin = fp(async app => {
  const prisma = new PrismaClient()

  app.decorate("prisma", prisma)

  app.addHook("onClose", async app => {
    await app.prisma.$disconnect()
  })
})
