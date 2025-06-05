import QRCode from 'qrcode'

import { InstanceRepository } from './instance.repository.js'
import { CreateInstanceInput, UpdateInstanceInput } from './instance.schema.js'
import { BaileysService } from '../../shared/services/baileys.service.js'
import { ResponseError } from '../../shared/utils/response-error.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'

export function InstanceService(
  instanceRepository: ReturnType<typeof InstanceRepository>,
  baileysService: ReturnType<typeof BaileysService>,
  redis: FastifyTypedInstance['redis']
) {
  return {
    create: async (data: CreateInstanceInput, user: FastifyTypedInstance['user']) => {
      const instance = await instanceRepository.create({
        name: data.name,
        number: data.number,
        status: 'DISCONNECTED',
        organizationId: user.organizationId,
        userId: user.sub,
      })

      if (!instance) throw new ResponseError(500, 'Instance not created')

      await baileysService.createBaileysInstance(instance.id)

      return instance
    },

    findAll: async () => {
      return instanceRepository.findAll()
    },

    findById: async (id: string) => {
      return instanceRepository.findById(id)
    },

    update: async (id: string, data: UpdateInstanceInput) => {
      return instanceRepository.update(id, data)
    },

    delete: async (id: string) => {
      const instance = await instanceRepository.findById(id)
      if (!instance) throw new ResponseError(404, 'Instance not found')

      await Promise.all([instanceRepository.delete(id), baileysService.deleteBaileysInstance(id)])

      return 'Instance deleted successfully'
    },

    findQrCode: async (id: string) => {
      const qrString = await redis.get(`whatsapp:qr:${id}`)

      if (!qrString) {
        throw new ResponseError(404, 'QR Code not available')
      }

      const qrBuffer = await QRCode.toBuffer(qrString, { type: 'png' })

      return qrBuffer
    },
  }
}
