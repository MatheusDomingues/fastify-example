import { OrganizationDto } from "./organization.dto.js"
import { UserModel } from "../models/user.model.js"

export class UserDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  email: string
  status?: string
  organizations?: Omit<OrganizationDto, "users">[]

  constructor(data: UserModel, status?: string, omitOrgs?: boolean) {
    this.id = data?.id
    this.createdAt = data?.createdAt
    this.updatedAt = data?.updatedAt
    this.name = data?.name
    this.email = data?.email
    this.status = status
    {
      !omitOrgs &&
        (this.organizations = data?.organizations?.map(
          organization => new OrganizationDto(organization?.organization, true)
        ))
    }
  }
}
