import { z } from "zod";

export const userRegisterSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
  passwordConfirmation: z.string()
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"]
})

export const userLoginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export type UserRegisterFormData = z.output<typeof userRegisterSchema>
export type UserLoginFormData = z.output<typeof userLoginSchema>

