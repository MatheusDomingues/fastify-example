import fs from 'fs'
import { join } from 'path'

import { useMultiFileAuthState, DisconnectReason, makeWASocket, WASocket } from '@whiskeysockets/baileys'

import { BaileysRepository } from './baileys.repository.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'
import { InstanceRepository } from '../instance/instance.repository.js'

export function BaileysService(
  app: FastifyTypedInstance,
  baileysRepository: ReturnType<typeof BaileysRepository>,
  instanceRepository: ReturnType<typeof InstanceRepository>
) {
  const sessionBasePath = join(process.cwd(), 'sessions')

  async function createBaileysInstance(instanceId: string): Promise<WASocket> {
    app.log.info(`Criando instância ${instanceId}`)
    const sessionFolder = join(sessionBasePath, instanceId)

    if (!fs.existsSync(sessionFolder)) {
      app.log.info(`Criando pasta da instância ${instanceId}`)
      fs.mkdirSync(sessionFolder, { recursive: true })
    }

    app.log.info(`Criando estado da instância ${instanceId}`)
    const { state, saveCreds } = await useMultiFileAuthState(sessionFolder)

    app.log.info(`Criando socket da instância ${instanceId}`)
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false, // Desliga QR no terminal pois vamos gerar a imagem
    })

    baileysRepository.set(instanceId, sock)

    app.log.info(`Encontrando configuração da instância ${instanceId}`)
    let instanceConfig = await instanceRepository.findById(instanceId)

    app.log.info(`Encontrando novo perfil e imagem da instância ${instanceId}`)
    const newProfileName = state?.creds?.me?.name
    const newImageUrl = state?.creds?.me?.imgUrl

    if (instanceConfig.profileName !== newProfileName || instanceConfig.imageUrl !== newImageUrl) {
      app.log.info(`Atualizando perfil e imagem da instância ${instanceId}`)
      instanceConfig = await instanceRepository.update(instanceId, {
        profileName: newProfileName,
        imageUrl: newImageUrl,
      })
    }

    app.log.info(`Adicionando evento de atualização de credenciais`)
    sock.ev.on('creds.update', saveCreds)

    app.log.info(`Adicionando evento de atualização de conexão`)
    sock.ev.on('connection.update', async update => {
      try {
        app.log.info(`Atualizando status da instância ${instanceId}`)
        instanceConfig = await instanceRepository.findById(instanceId)

        const { qr, connection, lastDisconnect } = update

        if (qr) {
          app.log.info(`Salvando QR da instância ${instanceId}`)
          await app.redis.set(`whatsapp:qr:${instanceId}`, qr)
        }
        if (
          connection === 'open' ||
          (connection === 'close' && (lastDisconnect?.error as any)?.output?.statusCode === DisconnectReason.loggedOut)
        ) {
          app.log.info(`Deletando QR da instância ${instanceId}`)
          await app.redis.del(`whatsapp:qr:${instanceId}`)
        }
        const newState =
          connection === 'open' ? 'CONNECTED' : connection === 'connecting' ? 'CONNECTING' : 'DISCONNECTED'

        if (instanceConfig?.status !== newState) {
          app.log.info(`Atualizando status da instância ${instanceId} para ${newState}`)
          instanceConfig = await instanceRepository.update(instanceId, {
            status: newState,
          })
        }
      } catch (error) {
        app.log.error(`Erro ao atualizar status da instância ${instanceId}: ${error}`)
      }
    })

    app.log.info(`Adicionando evento de recebimento de mensagens`)
    sock.ev.on('messages.upsert', async m => {
      try {
        app.log.info(`Recebendo mensagens na instância ${instanceId}`)
        instanceConfig = await instanceRepository.findById(instanceId)

        if (instanceConfig?.readMessagesAutomatically) {
          await sock.readMessages(m.messages.map(msg => msg.key))
        }

        if (instanceConfig?.simulateTyping) {
          const typingDelayMin = Math.max(0, Math.min(instanceConfig.messageDelayMin || 3, 30))
          const typingDelayMax = Math.max(0, Math.min(instanceConfig.messageDelayMax || 10, 30))

          const typingDelay = Math.random() * (typingDelayMax - typingDelayMin) + typingDelayMin

          const remoteJid = m.messages[0].key.remoteJid

          await sock.presenceSubscribe(remoteJid)

          setTimeout(() => {
            sock.sendPresenceUpdate('unavailable', remoteJid)
            app.log.info(`Simulação de digitação finalizada na instância ${instanceId}`)
          }, typingDelay * 1000)
        }

        app.log.info(`Mensagens recebidas na instância ${instanceId}`)
      } catch (error) {
        app.log.error(`Erro ao processar mensagens na instância ${instanceId}: ${error}`)
      }
    })

    app.log.info(`Adicionando evento de recebimento de chamadas`)
    sock.ev.on('call', async calls => {
      instanceConfig = await instanceRepository.findById(instanceId)

      if (!instanceConfig) return
      const call = calls[0]

      if (!call) return
      if (instanceConfig.manageReceivedCalls === 'AUDIO_ONLY' && !call.isVideo) {
        await sock.rejectCall(call.id, call.from)
        app.log.info(`Chamada de áudio recusada para a instância ${instanceId}`)
      }

      if (instanceConfig.manageReceivedCalls === 'VIDEO_ONLY' && call.isVideo) {
        await sock.rejectCall(call.id, call.from)
        app.log.info(`Chamada de vídeo recusada para a instância ${instanceId}`)
      }

      if (instanceConfig.manageReceivedCalls === 'NEVER') {
        app.log.info(`Chamada aceita para a instância ${instanceId}`)
      }
    })

    return sock
  }

  async function deleteBaileysInstance(instanceId: string): Promise<void> {
    app.log.info(`Deletando instância ${instanceId}`)
    try {
      const sessionFolder = join(sessionBasePath, instanceId)

      if (fs.existsSync(sessionFolder)) {
        fs.rmSync(sessionFolder, { recursive: true, force: true })
      }

      const keys = await app.redis.keys(`*:${instanceId}:*`)

      if (keys.length > 0) {
        await app.redis.del(...keys)
        app.log.info(`Chaves deletadas para a instância ${instanceId}:`, keys)
      } else {
        app.log.info(`Nenhuma chave encontrada para a instância ${instanceId}`)
      }

      app.log.info(`Instância ${instanceId} deletada com sucesso!`)
    } catch (error) {
      app.log.error(`Erro ao deletar instância ${instanceId}: ${error}`)
    }
  }

  return {
    createBaileysInstance,
    deleteBaileysInstance,
  }
}
