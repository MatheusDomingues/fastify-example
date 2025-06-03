import { z } from 'zod'

import { userDtoSchema } from '../user/user.schema.js'

export const organizationDtoSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  users: z.array(z.lazy(() => userDtoSchema.omit({ organizations: true }))).optional(),
})

export type OrganizationDtoSchema = z.infer<typeof organizationDtoSchema>
