import zod, { z } from "zod";

export const updateBody = zod.object({
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" })
    .optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
