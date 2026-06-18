import { z } from "zod";

const envValidator = z.object({
  NODE_ENV: z.enum(["development", "testing", "staging", "production"]),
  SQLITE_FILE_PATH: z.string().min(1),
  SQLITE_MODE: z
    .enum(["ROLLBACK_JOURNAL", "WRITE-AHEAD_LOG"])
    .default("ROLLBACK_JOURNAL"),
});

export const env = envValidator.parse(process.env);
