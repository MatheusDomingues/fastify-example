import { OrganizationModel } from './organization.model.js'

export type ApiKeyModel = {
  id: string
  name: string
  key: string
  createdAt: Date
  updatedAt: Date
  organizationId: string
  organization?: OrganizationModel
}
