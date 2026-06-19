import { type LoggerOptions, pino } from "pino";

import { env } from "@/config/env.server";

const loggerOptions: LoggerOptions =
  env.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
        },
      }
    : {};

export const logger = pino(loggerOptions);
