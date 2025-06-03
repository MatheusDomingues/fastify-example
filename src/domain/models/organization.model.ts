import { InstanceModel } from './instance.model.js'
import { InviteModel } from './invite.model.js'

export type OrganizationModel = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  users?: InviteModel[]
  instances?: InstanceModel[]
}
