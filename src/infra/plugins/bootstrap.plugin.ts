import fs from 'fs'
import { join } from 'path'

import { FastifyInstance } from 'fastify'

import { BaileysService } from '../../modules/baileys/baileys.service.js'
import { InstanceRepository } from '../../modules/instance/instance.repository.js'

export async function bootstrapPlugin(app: FastifyInstance) {
  const instanceRepository = InstanceRepository(app.prisma)
  const baileysService = BaileysService(app, instanceRepository)

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
      await baileysService.createBaileysInstance(instanceId)

      app.log.info(`Instance restored successfully: ${instanceId}`)
    } catch (error) {
      app.log.error(`Error restoring instance ${instanceId}:`, error)
    }
  }
}
