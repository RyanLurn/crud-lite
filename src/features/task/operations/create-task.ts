import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { InternalServerErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import { formatErrorMessage } from "@/utils/format-error-message";
import { taskTable } from "@/db/schema/tables/task";
import { HTTP_STATUS } from "@/utils/http-status";
import { db } from "@/db";

export const createTaskValidator = z.object({
  name: z
    .string("Task name is invalid.")
    .trim()
    .normalize("NFC")
    .min(1, "Task name is required.")
    .max(100, "Task name is too long."),
});

export const createTask = createServerFn({ method: "POST" })
  .validator(createTaskValidator)
  .handler(
    async ({ data }): Promise<Result<string, InternalServerErrorCode>> => {
      const { name } = data;
      try {
        const id = Bun.randomUUIDv7();
        await db.insert(taskTable).values({ id, name });

        setResponseStatus(HTTP_STATUS.CREATED.code, HTTP_STATUS.CREATED.text);
        return {
          success: true,
          data: id,
        };
      } catch (error) {
        const message = formatErrorMessage({
          action: "add task",
          reason: "an unexpected error",
        });

        console.error(message);
        console.error(error);

        setResponseStatus(
          HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          HTTP_STATUS.INTERNAL_SERVER_ERROR.text
        );

        return {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message,
            retryable: false,
          },
        };
      }
    }
  );
