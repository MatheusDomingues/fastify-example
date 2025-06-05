import QRCode from 'qrcode'

import { InstanceRepository } from './instance.repository.js'
import { CreateInstanceInput, UpdateInstanceInput } from './instance.schema.js'
import { ResponseError } from '../../shared/utils/response-error.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'
import { BaileysService } from '../baileys/baileys.service.js'

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
        userId: user?.sub,
      })

      if (!instance) throw new ResponseError(500, 'Instance not created')

      await baileysService.createBaileysInstance(instance.id)

      return instance
    },

    findAll: async (user: FastifyTypedInstance['user']) => {
      const instances = await instanceRepository.findAll({
        organizationId: user.organizationId,
      })

      return instances
    },

    findById: async (id: string, user: FastifyTypedInstance['user']) => {
      const instance = await instanceRepository.findById(id)

      if (!instance) throw new ResponseError(400, 'Instance not found')
      if (instance.organizationId !== user.organizationId) throw new ResponseError(401, 'User not authorized')

      return instance
    },

    update: async (id: string, data: UpdateInstanceInput, user: FastifyTypedInstance['user']) => {
      const instance = await instanceRepository.findById(id)

      if (!instance) throw new ResponseError(400, 'Instance not found')
      if (instance.organizationId !== user.organizationId) throw new ResponseError(401, 'User not authorized')

      return await instanceRepository.update(id, data)
    },

    delete: async (id: string, user: FastifyTypedInstance['user']) => {
      const instance = await instanceRepository.findById(id)
      if (!instance) throw new ResponseError(404, 'Instance not found')
      if (instance.organizationId !== user.organizationId) throw new ResponseError(401, 'User not authorized')

      await Promise.all([instanceRepository.delete(id), baileysService.deleteBaileysInstance(id)])

      return 'Instance deleted successfully'
    },

    findQrCode: async (id: string, user: FastifyTypedInstance['user']) => {
      const instance = await instanceRepository.findById(id)

      if (!instance) throw new ResponseError(404, 'Instance not found')
      if (instance.organizationId !== user.organizationId) throw new ResponseError(401, 'User not authorized')

      const qrString = await redis.get(`whatsapp:qr:${id}`)
      if (!qrString) throw new ResponseError(404, 'QR Code not available')

      const qrBuffer = await QRCode.toBuffer(qrString, { type: 'png' })

      return qrBuffer
    },
  }
}
