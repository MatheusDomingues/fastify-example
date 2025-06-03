import { Redis } from "ioredis"

import { UserModel } from "../../../domain/models/user.model.js"
import { ForgotPasswordInput } from "../../../domain/schemas/auth.schema.js"
import { MailService } from "../../../shared/services/mail.service.js"
import { ResponseError } from "../../../shared/utils/response-error.js"
import { UserRepository } from "../../user/user.repository.js"

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
    private redis: Redis
  ) {}

  async execute(request: ForgotPasswordInput): Promise<string> {
    const user = await this.userRepository.findByEmail(request.email)
    if (!user) throw new ResponseError(400, "Email not found")

    const code = this.generateCode(6)

    await this.redis.set(`forgot-password:${request.email}`, code, "EX", 1000 * 60 * 20)

    await this.mailService.emails.send({
      from: String(process.env.EMAIL_FROM),
      to: request.email,
      subject: "Código de validação para alteração de senha",
      text: "Você solicitou alteração de senha, aqui está seu código de validação...",
      html: this.html(user, code),
    })

    return "Code sent to email"
  }

  generateCode(length: number) {
    let result = ""
    const characters = "A1B2C3D4E5F6G7H8I9J1K2L3M4N5O6P7Q8R9S1T2U3V4W5X6Y7Z8"
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return result
  }

  html(user: UserModel, code: string) {
    return `
      <body style="margin: 0; padding: 0; background-color: #f4f4f4">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
          <tr>
            <td align="center">
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                bgcolor="#ffffff"
                style="margin: 20px 0; border-radius: 8px; overflow: hidden"
              >
                <tr>
                  <td align="center" bgcolor="#171717" style="padding: 20px">
                    <h1 style="color: #ffffff; font-family: Arial, sans-serif; font-size: 24px">Recuperação de Senha</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; font-family: Arial, sans-serif; color: #333333">
                    <p style="font-size: 16px; margin: 0 0 10px">Olá, ${user?.name}</p>
                    <p style="font-size: 16px; margin: 0 0 10px">
                      Recebemos uma solicitação para redefinir sua senha. Use o código abaixo para continuar:
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0">
                      <tr>
                        <td
                          align="center"
                          bgcolor="#eeeeee"
                          style="padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 2px"
                        >
                          ${code}
                        </td>
                      </tr>
                    </table>

                    <p style="font-size: 16px; margin: 0 0 10px">
                      Se você não solicitou a alteração de senha, pode ignorar este e-mail.
                    </p>

                    <p style="font-size: 16px; margin: 20px 0 0">
                      Atenciosamente,<br />
                      Equipe Linkify
                    </p>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#f4f4f4" style="padding: 10px; text-align: center; font-size: 12px; color: #888888">
                    &copy; 2025 Linkify. Todos os direitos reservados.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>`
  }
}
