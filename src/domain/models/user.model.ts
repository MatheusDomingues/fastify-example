import { User } from "@prisma/client"

import { InviteModel } from "./invite.model.js"

export class UserModel implements User {
  id: string
  name: string | null
  email: string
  password: string | null
  createdAt: Date
  updatedAt: Date
  organizations?: InviteModel[]

  constructor(data: {
    id?: string
    name: string | null
    email: string
    password?: string | null
    organizations?: InviteModel[]
  }) {
    this.id = data?.id
    this.name = data?.name
    this.email = data?.email
    this.password = data?.password
    this.organizations = data?.organizations
  }
}
