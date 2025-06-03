import { $Enums } from '@prisma/client'

import { OrganizationModel } from './organization.model.js'
import { UserModel } from './user.model.js'

export type InviteModel = {
  id: number
  createdAt: Date
  updatedAt: Date
  email: string
  status: $Enums.InviteStatus
  organizationId: string
  userId?: string
  organization?: OrganizationModel
  user?: UserModel
}
