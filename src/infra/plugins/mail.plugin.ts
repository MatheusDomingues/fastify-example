import fp from 'fastify-plugin'
import { Resend } from 'resend'

export const mailPlugin = fp(async app => {
  const resend = new Resend(process.env.RESEND_API_KEY)

  app.decorate('mail', resend)
})
