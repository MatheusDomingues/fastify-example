import { ConnectionState, DisconnectReason } from '@whiskeysockets/baileys'
import { Job } from 'bullmq'

import { InstanceRepository } from '../modules/instance/instance.repository.js'
import { FastifyTypedInstance } from '../types/fastifyTypedInstance.js'

export function connectionUpdateWorker(app: FastifyTypedInstance) {
  const instanceRepository = InstanceRepository(app.prisma)

  app.worker(
    'baileys-connection-update',
    async (job: Job<{ instanceId: string; update: Partial<ConnectionState> }>) => {
      const { instanceId, update } = job.data
      app.log.info(`Connection update worker started ${instanceId}`)

      try {
        const instance = await instanceRepository.findById(instanceId)
        if (!instance) {
          app.log.error(`Instance not found ${instanceId}`)
          return
        }

        const { qr, connection, lastDisconnect } = update
        if (qr) {
          app.log.info(`Saving QR for instance ${instanceId}`)
          await app.redis.set(`whatsapp:qr:${instanceId}`, qr)
        }
        if (
          connection === 'open' ||
          (connection === 'close' && (lastDisconnect?.error as any)?.output?.statusCode === DisconnectReason.loggedOut)
        ) {
          app.log.info(`Deleting QR for instance ${instanceId}`)
          await app.redis.del(`whatsapp:qr:${instanceId}`)
        }

        const newState =
          connection === 'open' ? 'CONNECTED' : connection === 'connecting' ? 'CONNECTING' : 'DISCONNECTED'

        if (instance?.status !== newState) {
          app.log.info(`Updating instance status ${instanceId} to ${newState}`)
          await instanceRepository.update(instanceId, { status: newState })
        }
      } catch (error) {
        app.log.error(`Error updating instance status ${instanceId}: ${error}`)
      }
    }
  )
}
