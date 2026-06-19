import type { Level } from "pino";

import { z } from "zod";

export const logLevels: Level[] = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
] as const;

const envValidator = z.object({
  NODE_ENV: z.enum(["development", "testing", "staging", "production"]),
  SQLITE_FILE_PATH: z.string().min(1),
  SQLITE_MODE: z
    .enum(["ROLLBACK_JOURNAL", "WRITE-AHEAD_LOG"])
    .default("ROLLBACK_JOURNAL"),
  LOG_LEVEL: z.enum(logLevels).default("info"),
});

export const env = envValidator.parse(process.env);
