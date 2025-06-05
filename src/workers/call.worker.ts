import { WACallEvent } from '@whiskeysockets/baileys'
import { Job } from 'bullmq'

import { InstanceRepository } from '../modules/instance/instance.repository.js'
import { FastifyTypedInstance } from '../types/fastifyTypedInstance.js'

export function callWorker(app: FastifyTypedInstance) {
  const instanceRepository = InstanceRepository(app.prisma)

  app.worker('baileys-call', async (job: Job<{ instanceId: string; calls: WACallEvent[] }>) => {
    const { instanceId, calls } = job.data
    app.log.info(`Call worker started ${instanceId}`)

    try {
      const sock = app.baileysRepository.get(instanceId)
      if (!sock) {
        app.log.error(`Instance socket not found ${instanceId}`)
        return
      }

      const instance = await instanceRepository.findById(instanceId)
      if (!instance) {
        app.log.error(`Instance not found ${instanceId}`)
        return
      }

      const call = calls[0]
      if (!call) return

      if (['AUDIO_ONLY', 'ALL'].includes(instance.manageReceivedCalls) && !call.isVideo) {
        await sock.rejectCall(call.id, call.from)
        app.log.info(`Audio call refused for instance ${instanceId}`)
      }

      if (['VIDEO_ONLY', 'ALL'].includes(instance.manageReceivedCalls) && call.isVideo) {
        await sock.rejectCall(call.id, call.from)
        app.log.info(`Video call refused for instance ${instanceId}`)
      }

      if (instance.manageReceivedCalls === 'NEVER') {
        app.log.info(`Call accepted for instance ${instanceId}`)
      }

      app.log.info(`Call ${call.id} handled for instance ${instanceId}`)
    } catch (error) {
      app.log.error(`Error handling call ${instanceId}: ${error}`)
    }
  })
}
