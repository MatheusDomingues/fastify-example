import { Resend } from "resend"

export class MailService extends Resend {
  constructor() {
    super(process.env.RESEND_API_KEY)
  }
}
