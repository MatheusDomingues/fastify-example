import { z } from 'zod'

export const emptyResponse = z.null().optional()
export const idParamsSchema = z.object({ id: z.string() })
