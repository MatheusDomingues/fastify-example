import { InviteModel } from './invite.model.js'

export type UserModel = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  email: string
  password?: string
  organizations?: InviteModel[]
}
