import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  organizationName: z.string().min(1, "Organization name is required"),
})

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
})

export const validateCodeSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  code: z.string().min(1, "Code is required"),
})

export const resetPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ValidateCodeInput = z.infer<typeof validateCodeSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
