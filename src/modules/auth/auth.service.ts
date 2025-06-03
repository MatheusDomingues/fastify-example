import bcrypt from 'bcryptjs'
import { Redis } from 'ioredis'
import { Resend } from 'resend'

import { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput, ValidateCodeInput } from './auth.schema.js'
import { UserModel } from '../../domain/models/user.model.js'
import { CommonUtils } from '../../shared/utils/common.js'
import { ResponseError } from '../../shared/utils/response-error.js'
import { OrganizationRepository } from '../organization/organization.repository.js'
import { UserRepository } from '../user/user.repository.js'

export function AuthService(
  redis: Redis,
  mail: Resend,
  userRepository: ReturnType<typeof UserRepository>,
  organizationRepository: ReturnType<typeof OrganizationRepository>
) {
  return {
    login: async (data: LoginInput): Promise<UserModel> => {
      const user = await userRepository.findByEmail(data.email)

      if (!user) throw new ResponseError(401, 'User not found')
      if (!user?.password) throw new ResponseError(401, 'Other method used')

      const isPasswordsMatch = await bcrypt.compare(data.password, user.password)
      if (!isPasswordsMatch) throw new ResponseError(401, 'Wrong email or password')

      return user
    },

    register: async (data: RegisterInput): Promise<string> => {
      const { name, email, password, confirmPassword, organizationName } = data

      if (password !== confirmPassword) {
        throw new ResponseError(400, 'Passwords do not match')
      }

      const userExists = await userRepository.findByEmail(email)
      if (userExists) {
        throw new ResponseError(400, 'Email already in use')
      }

      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(password, salt)

      const user = await userRepository.create({
        name,
        email,
        password: passwordHash,
      })

      await organizationRepository.create({
        name: organizationName,
        users: {
          create: {
            userId: user.id,
            email: user.email,
            status: 'APPROVED',
          },
        },
      })

      return 'User registered successfully'
    },

    forgotPassword: async (request: ForgotPasswordInput): Promise<string> => {
      const user = await userRepository.findByEmail(request.email)
      if (!user) throw new ResponseError(400, 'Email not found')

      const code = CommonUtils.generateCode(6)

      await redis.set(`forgot-password:${request.email}`, code, 'EX', 1000 * 60 * 20)

      await mail.emails.send({
        from: String(process.env.EMAIL_FROM),
        to: request.email,
        subject: 'Código de validação para alteração de senha',
        text: 'Você solicitou alteração de senha, aqui está seu código de validação...',
        html: html(user, code),
      })

      return 'Code sent to email'
    },

    validateCode: async (request: ValidateCodeInput): Promise<string> => {
      const code = await redis.get(`forgot-password:${request.email}`)
      if (!code) throw new ResponseError(400, 'Code expired')
      if (code !== request.code) throw new ResponseError(400, 'Invalid code')

      await redis.set(`forgot-password:${request.email}`, 'VALIDATED')

      return 'Código validado com sucesso'
    },

    resetPassword: async (request: ResetPasswordInput): Promise<string> => {
      let user = await userRepository.findByEmail(request.email)
      if (!user) throw new ResponseError(400, 'Email not found')

      const code = await redis.get(`forgot-password:${request.email}`)
      if (code !== 'VALIDATED') throw new ResponseError(400, 'Code not validated')

      if (request.password !== request.confirmPassword) throw new ResponseError(400, 'Passwords do not match')

      const salt = await bcrypt.genSalt(10)
      const password = await bcrypt.hash(request.password, salt)

      user = await userRepository.update(user.id, { password })
      if (!user) throw new ResponseError(500, 'User was not updated')

      await redis.del(`forgot-password:${request.email}`)

      return 'Senha atualizada com sucesso'
    },
  }
}

function html(user: UserModel, code: string) {
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
                <td style="padding: 20px; font-family: Arial, sans-serif; color: #500033">
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
