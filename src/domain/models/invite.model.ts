import { $Enums, Invite } from "@prisma/client"

import { OrganizationModel } from "./organization.model.js"
import { UserModel } from "./user.model.js"

export class InviteModel implements Invite {
  id: number
  email: string
  status: $Enums.InviteStatus
  createdAt: Date
  updatedAt: Date
  userId: string | null
  organizationId: string
  organization?: OrganizationModel
  user?: UserModel

  constructor(data: {
    id?: number
    email: string
    status?: $Enums.InviteStatus
    userId?: string | null
    organizationId: string
  }) {
    this.id = data?.id
    this.email = data?.email
    this.status = data?.status || "PENDING"
    this.userId = data?.userId
    this.organizationId = data?.organizationId
  }
}
