import { UserDto } from './user.dto.js'
import { OrganizationDtoSchema } from '../../modules/organization/organization.schema.js'
import { OrganizationModel } from '../models/organization.model.js'

export function OrganizationDto(data: OrganizationModel, omitUsers?: boolean): OrganizationDtoSchema {
  return {
    ...data,
    users: !omitUsers ? data?.users?.map(user => UserDto(user?.user)) || [] : undefined,
  }
}
