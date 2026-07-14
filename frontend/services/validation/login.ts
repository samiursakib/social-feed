import z from "zod";

const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const specialCharacterRegex = /[^A-Za-z0-9]/;

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password is too long")
    .regex(
      uppercaseRegex,
      "Password must contain at least one uppercase letter",
    )
    .regex(
      lowercaseRegex,
      "Password must contain at least one lowercase letter",
    )
    .regex(numberRegex, "Password must contain at least one digit")
    .regex(
      specialCharacterRegex,
      "Password must contain at least one special character",
    ),
});
