import fs from 'fs'
import { join } from 'path'

import { useMultiFileAuthState, makeWASocket, WASocket } from '@whiskeysockets/baileys'

import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'
import { InstanceRepository } from '../instance/instance.repository.js'

export function BaileysService(app: FastifyTypedInstance, instanceRepository: ReturnType<typeof InstanceRepository>) {
  const sessionBasePath = join(process.cwd(), 'sessions')

  async function createBaileysInstance(instanceId: string): Promise<WASocket> {
    app.log.info(`Creating instance ${instanceId}`)
    const sessionFolder = join(sessionBasePath, instanceId)

    if (!fs.existsSync(sessionFolder)) {
      app.log.debug(`Creating instance folder ${instanceId}`)
      fs.mkdirSync(sessionFolder, { recursive: true })
    }

    app.log.debug(`Creating instance state ${instanceId}`)
    const { state, saveCreds } = await useMultiFileAuthState(sessionFolder)

    app.log.debug(`Creating socket for instance ${instanceId}`)
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
    })

    app.baileysRepository.set(instanceId, sock)

    app.log.debug(`Finding instance configuration ${instanceId}`)
    const instanceConfig = await instanceRepository.findById(instanceId)

    app.log.debug(`Finding new profile and image ${instanceId}`)
    const newProfileName = state?.creds?.me?.name
    const newImageUrl = state?.creds?.me?.imgUrl

    if (instanceConfig.profileName !== newProfileName || instanceConfig.imageUrl !== newImageUrl) {
      app.log.debug(`Updating profile and image ${instanceId}`)
      await instanceRepository.update(instanceId, {
        profileName: newProfileName,
        imageUrl: newImageUrl,
      })
    }

    app.log.debug(`Adding credentials update event`)
    sock.ev.on('creds.update', saveCreds)

    app.log.debug(`Adding connection update event`)
    sock.ev.on('connection.update', async update => {
      try {
        app.log.debug(`Sending connection update event to queue ${instanceId}`)

        await app.queues.send('baileys.connection.update', instanceId, {
          instanceId,
          update,
        })

        app.log.debug(`Connection update sent to queue ${instanceId}`)
      } catch (error) {
        app.log.error(`Error to send connection update to queue ${instanceId}: ${error}`)
      }
    })

    app.log.debug(`Adding message receipt event`)
    sock.ev.on('messages.upsert', async m => {
      try {
        app.log.debug(`Sending messages to queue ${instanceId}`)

        await app.queues.send('baileys.messages.upsert', instanceId, {
          instanceId,
          messages: m.messages,
          type: m.type,
        })

        app.log.info(`Messages sent to queue ${instanceId}`)
      } catch (error) {
        app.log.error(`Error to send messages to queue ${instanceId}: ${error}`)
      }
    })

    app.log.info(`Adding call receipt event`)
    sock.ev.on('call', async calls => {
      try {
        app.log.debug(`Sending messages to queue ${instanceId}`)

        await app.queues.send('baileys.call', instanceId, {
          instanceId,
          calls,
        })

        app.log.debug(`Messages sent to queue ${instanceId}`)
      } catch (error) {
        app.log.error(`Error to send messages to queue ${instanceId}: ${error}`)
      }
    })

    return sock
  }

  async function deleteBaileysInstance(instanceId: string): Promise<void> {
    app.log.info(`Deleting instance ${instanceId}`)
    try {
      const sessionFolder = join(sessionBasePath, instanceId)

      if (fs.existsSync(sessionFolder)) {
        fs.rmSync(sessionFolder, { recursive: true, force: true })
      }

      const keys = await app.redis.keys(`*:${instanceId}:*`)

      if (keys.length > 0) {
        await app.redis.del(...keys)
        app.log.debug(`Keys deleted for instance ${instanceId}:`, keys)
      } else {
        app.log.debug(`No keys found for instance ${instanceId}`)
      }

      app.log.info(`Instance ${instanceId} deleted successfully!`)
    } catch (error) {
      app.log.error(`Error deleting instance ${instanceId}: ${error}`)
    }
  }

  return {
    createBaileysInstance,
    deleteBaileysInstance,
  }
}
