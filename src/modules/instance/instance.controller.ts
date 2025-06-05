import { FastifyReply, FastifyRequest } from 'fastify'

import { InstanceRepository } from './instance.repository.js'
import { CreateInstanceInput } from './instance.schema.js'
import { InstanceService } from './instance.service.js'
import { InstanceDto } from '../../domain/dtos/instance.dto.js'
import { handleError } from '../../shared/utils/handle-error.js'
import { FastifyTypedInstance } from '../../types/fastifyTypedInstance.js'
import { BaileysService } from '../baileys/baileys.service.js'

export function InstanceController(app: FastifyTypedInstance) {
  const instanceRepository = InstanceRepository(app.prisma)
  const baileysService = BaileysService(app, instanceRepository)
  const instanceService = InstanceService(instanceRepository, baileysService, app.redis)

  return {
    create: async (request: FastifyRequest<{ Body: CreateInstanceInput }>, reply: FastifyReply) => {
      try {
        const instance = await instanceService.create(request.body, app.user)

        reply.code(201).send(InstanceDto(instance))
      } catch (error) {
        handleError(error, reply)
      }
    },

    findAll: async (_: FastifyRequest, reply: FastifyReply) => {
      try {
        const instances = await instanceService.findAll(app.user)
        reply.code(200).send(instances.map(instance => InstanceDto(instance)))
      } catch (error) {
        handleError(error, reply)
      }
    },

    findById: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const instance = await instanceService.findById(request.params.id, app.user)
        reply.code(200).send(InstanceDto(instance))
      } catch (error) {
        handleError(error, reply)
      }
    },

    update: async (request: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) => {
      try {
        const instance = await instanceService.update(request.params.id, request.body, app.user)
        reply.code(200).send(instance)
      } catch (error) {
        handleError(error, reply)
      }
    },

    delete: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        await instanceService.delete(request.params.id, app.user)

        reply.code(200).send({ message: 'Instance deleted' })
      } catch (error) {
        handleError(error, reply)
      }
    },

    findQrCode: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const qrCode = await instanceService.findQrCode(request.params.id, app.user)

        reply.code(200).send(qrCode)
      } catch (error) {
        handleError(error, reply)
      }
    },
  }
}
