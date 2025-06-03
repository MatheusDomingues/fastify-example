import { FastifyReply, FastifyRequest } from 'fastify'

import { InstanceRepository } from './instance.repository.js'
import { InstanceService } from './instance.service.js'
import { BaileysService } from '../../shared/services/baileys.service.js'
import { handleError } from '../../shared/utils/handle-error.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'

export function InstanceController(prisma: FastifyTypedInstance['prisma']) {
  const baileysService = BaileysService()
  const instanceRepository = InstanceRepository(prisma)
  const service = InstanceService(instanceRepository, baileysService)

  return {
    create: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const instance = await service.create(request.body)
        reply.code(201).send(instance)
      } catch (error) {
        handleError(error, reply)
      }
    },

    findAll: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const instances = await service.findAll()
        reply.send(instances)
      } catch (error) {
        handleError(error, reply)
      }
    },

    findById: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const instance = await service.findById(request.params.id)
        reply.send(instance)
      } catch (error) {
        handleError(error, reply)
      }
    },

    update: async (request: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) => {
      try {
        const instance = await service.update(request.params.id, request.body)
        reply.send(instance)
      } catch (error) {
        handleError(error, reply)
      }
    },

    delete: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const instance = await service.delete(request.params.id)
        reply.send({ message: 'Instance deleted', instance })
      } catch (error) {
        handleError(error, reply)
      }
    },
  }
}
