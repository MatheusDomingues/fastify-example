import { z } from "zod"

import { organizationDtoSchema } from "./organization.schema.js"

export const userDtoSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  email: z.string().email(),
  status: z.string().optional(),
  organizations: z.array(z.lazy(() => organizationDtoSchema.omit({ users: true }))).optional(),
})

export type UserDtoSchema = z.infer<typeof userDtoSchema>
