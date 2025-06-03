import { UserDto } from './user.dto.js'
import { OrganizationDtoSchema } from '../../modules/organization/organization.schema.js'
import { OrganizationModel } from '../models/organization.model.js'

export function OrganizationDto(data: OrganizationModel, omitUsers?: boolean): OrganizationDtoSchema {
  const dto = {
    id: data?.id,
    name: data?.name,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
    users: !omitUsers ? data?.users?.map(user => UserDto(user?.user)) || [] : undefined,
  }

  Object.keys(dto).forEach(key => {
    if (dto[key] === undefined) {
      delete dto[key]
    }
  })

  return dto
}
