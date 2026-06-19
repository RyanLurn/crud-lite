import { type LoggerOptions, pino } from "pino";

import { env } from "@/config/env.server";

const loggerOptions: LoggerOptions =
  env.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
        },
        level: env.LOG_LEVEL,
      }
    : { level: env.LOG_LEVEL };

export const logger = pino(loggerOptions);
