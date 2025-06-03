import { z } from 'zod'

import { organizationDtoSchema } from '../organization/organization.schema.js'

export const userDtoSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  email: z.string().email(),
  access_token: z.string().optional(),
  organizationId: z.string().optional(),
  organizations: z.array(z.lazy(() => organizationDtoSchema.omit({ users: true }))),
})

export type UserDtoSchema = z.infer<typeof userDtoSchema>
