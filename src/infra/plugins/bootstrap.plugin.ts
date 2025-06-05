import fs from 'fs'
import { join } from 'path'

import { FastifyInstance } from 'fastify'

import { BaileysRepository } from '../../modules/baileys/baileys.repository.js'
import { BaileysService } from '../../modules/baileys/baileys.service.js'
import { InstanceRepository } from '../../modules/instance/instance.repository.js'

export async function bootstrapPlugin(app: FastifyInstance) {
  const instanceRepository = InstanceRepository(app.prisma)
  const baileysRepository = BaileysRepository()
  const baileysService = BaileysService(app, baileysRepository, instanceRepository)

  const sessionPath = join(process.cwd(), 'sessions')

  if (!fs.existsSync(sessionPath)) {
    app.log.info('Session directory not found. No instances will be restored.')
    return
  }

  const instanceIds = fs.readdirSync(sessionPath)

  if (!instanceIds.length) {
    app.log.info('No instances found in session directory.')
    return
  }

  for (const instanceId of instanceIds) {
    try {
      const sock = await baileysService.createBaileysInstance(instanceId)
      baileysRepository.set(instanceId, sock)
      app.log.info(`Instance restored successfully: ${instanceId}`)
    } catch (error) {
      app.log.error(`Error restoring instance ${instanceId}:`, error)
    }
  }
}
