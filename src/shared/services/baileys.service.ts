import fs from 'fs'
import { join } from 'path'

import { useMultiFileAuthState, DisconnectReason, makeWASocket, WASocket } from '@whiskeysockets/baileys'

export function BaileysService() {
  // Pasta base para salvar as sessões
  const sessionBasePath = join(process.cwd(), 'sessions')

  async function createBaileysInstance(instanceId: string): Promise<WASocket> {
    const sessionFolder = join(sessionBasePath, instanceId)

    if (!fs.existsSync(sessionFolder)) {
      fs.mkdirSync(sessionFolder, { recursive: true })
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionFolder)

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', update => {
      const { connection, lastDisconnect } = update
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut
        if (shouldReconnect) {
          createBaileysInstance(instanceId)
        }
      }
    })

    sock.ev.on('messages.upsert', m => {
      // Aqui você pode adicionar lógica para processar mensagens recebidas
      // Por enquanto só loga
      console.log(`Mensagem recebida na instância ${instanceId}`, m)
    })

    return sock
  }

  return {
    createBaileysInstance,
  }
}
