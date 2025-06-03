import { OrganizationDto } from './organization.dto.js'
import { UserDtoSchema } from '../../modules/user/user.schema.js'
import { UserModel } from '../models/user.model.js'

export function UserDto(
  data: UserModel,
  access_token?: string,
  organizationId?: string,
  omitOrgs?: boolean
): UserDtoSchema {
  return {
    id: data?.id,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
    name: data?.name,
    email: data?.email,
    access_token: access_token || undefined,
    organizationId: organizationId || undefined,
    organizations: !omitOrgs
      ? data?.organizations?.map(organization => OrganizationDto(organization?.organization, true)) || []
      : undefined,
  }
}
