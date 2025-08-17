import zod, { z } from "zod";

const signUpBody = zod.object({
  username: z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
  firstName: z.string(),
  lastName: z.string(),
});
