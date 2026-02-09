import z from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
})

export const signupFormSchema = z.object({
    name: z
      .string()
      .min(3, "Minimum of 3 characters required."),
    email: z
      .string()
      .email("Please enter a valid email address."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
    avatar: z
      .instanceof(File)
      .optional()
      .nullable()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });