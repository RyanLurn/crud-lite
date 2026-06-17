import { z } from "zod";

const envValidator = z.object({
  NODE_ENV: z.enum(["development", "testing", "staging", "production"]),
  SQLITE_FILE_PATH: z.string().min(1),
});

export const env = envValidator.parse(process.env);
