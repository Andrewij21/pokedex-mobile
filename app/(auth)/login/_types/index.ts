import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username wajib diisi" }),

  password: z
    .string()
    .min(1, { message: "Password wajib diisi" })
    .min(6, { message: "Password minimal 6 karakter" }),
});
export type LoginSchemaFormData = z.infer<typeof loginSchema>;
