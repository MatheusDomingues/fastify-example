import { WASocket } from '@whiskeysockets/baileys'

const instances = new Map<string, WASocket>()

export function BaileysRepository() {
  return {
    set: (instanceId: string, sock: WASocket) => {
      instances.set(instanceId, sock)
    },

    get: (instanceId: string): WASocket | undefined => {
      return instances.get(instanceId)
    },

    delete: (instanceId: string) => {
      instances.delete(instanceId)
    },

    has: (instanceId: string) => {
      return instances.has(instanceId)
    },
  }
}
