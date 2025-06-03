import { InstanceRepository } from './instance.repository.js'
import { CreateInstanceInput, UpdateInstanceInput } from './instance.schema.js'
import { BaileysService } from '../../shared/services/baileys.service.js'

export function InstanceService(
  instanceRepository: ReturnType<typeof InstanceRepository>,
  baileysService: ReturnType<typeof BaileysService>
) {
  return {
    create: async (data: CreateInstanceInput) => {
      const instance = await instanceRepository.create({
        name: data.name,
        number: data.number,
        status: 'DISCONNECTED',
        organization: {
          connect: {
            id: '',
          },
        },
      })

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
      return instanceRepository.delete(id)
    },
  }
}
