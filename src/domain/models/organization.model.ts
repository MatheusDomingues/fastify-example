import { Organization } from "@prisma/client"

import { InviteModel } from "./invite.model.js"

export class OrganizationModel implements Organization {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  users?: InviteModel[]

  constructor(data: { id?: string; name: string; users?: InviteModel[] }) {
    this.id = data?.id
    this.name = data?.name
    this.users = data?.users
  }
}
