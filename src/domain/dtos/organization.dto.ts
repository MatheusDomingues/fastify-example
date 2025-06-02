import { UserDto } from "./user.dto.js"
import { OrganizationModel } from "../models/organization.model.js"

export class OrganizationDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  users?: UserDto[]

  constructor(data: OrganizationModel, omitUsers?: boolean) {
    this.id = data?.id
    this.name = data?.name
    this.createdAt = data?.createdAt
    this.updatedAt = data?.updatedAt
    {
      !omitUsers && (this.users = data?.users?.map(user => new UserDto(user?.user)))
    }
  }
}
