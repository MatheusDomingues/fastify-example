import { OrganizationDto } from './organization.dto.js'
import { UserDtoSchema } from '../../modules/user/user.schema.js'
import { UserModel } from '../models/user.model.js'

export function UserDto(data: UserModel, status?: string, omitOrgs?: boolean): UserDtoSchema {
  const dto = {
    id: data?.id,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
    name: data?.name,
    email: data?.email,
    status: status,
    organizations: !omitOrgs
      ? data?.organizations?.map(organization => OrganizationDto(organization?.organization, true)) || []
      : undefined,
  }

  Object.keys(dto).forEach(key => {
    if (dto[key] === undefined) {
      delete dto[key]
    }
  })

  return dto
}
