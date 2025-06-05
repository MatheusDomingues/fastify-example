import fp from 'fastify-plugin'

import { BaileysRepository } from '../../modules/baileys/baileys.repository.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'

export const baileysPlugin = fp((app: FastifyTypedInstance) => {
  const baileysRepository = BaileysRepository()

  app.decorate('baileysRepository', baileysRepository)
})
