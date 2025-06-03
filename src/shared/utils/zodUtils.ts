import { z } from "zod"

export const emptyResponse = z.null().optional()
export const idParams = z.object({ id: z.string() })
