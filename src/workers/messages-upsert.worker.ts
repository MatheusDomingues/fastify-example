import { MessageUpsertType, WAMessage } from '@whiskeysockets/baileys'
import { Job } from 'bullmq'

import { InstanceRepository } from '../modules/instance/instance.repository.js'
import { FastifyTypedInstance } from '../types/fastifyTypedInstance.js'

export function messagesUpsertWorker(app: FastifyTypedInstance) {
  const instanceRepository = InstanceRepository(app.prisma)

  app.worker(
    'baileys-messages-upsert',
    async (job: Job<{ instanceId: string; messages: WAMessage[]; type: MessageUpsertType }>) => {
      const { instanceId, messages } = job.data
      app.log.info(`Messages upsert worker started ${instanceId}`)

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

        if (instance.readMessagesAutomatically) {
          await sock.readMessages(messages.map(msg => msg.key))
        }

        if (instance.simulateTyping) {
          const typingDelayMin = Math.max(0, Math.min(instance.messageDelayMin || 3, 30))
          const typingDelayMax = Math.max(0, Math.min(instance.messageDelayMax || 10, 30))

          const typingDelay = Math.random() * (typingDelayMax - typingDelayMin) + typingDelayMin

          const remoteJid = messages[0].key.remoteJid

          await sock.presenceSubscribe(remoteJid)

          setTimeout(() => {
            sock.sendPresenceUpdate('unavailable', remoteJid)
            app.log.info(`Typing simulation finished for instance ${instanceId}`)
          }, typingDelay * 1000)
        }

        app.log.info(`Messages upserted for instance ${instanceId}`)
      } catch (error) {
        app.log.error(`Error upserting messages for instance ${instanceId}: ${error}`)
      }
    }
  )
}
