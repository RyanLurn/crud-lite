import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import type { FallbackErrorCode, NotFoundErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import { TASK_STATUS_ENUM, taskTable } from "@/db/schema/tables/task";
import { formatErrorMessage } from "@/utils/format-error-message";
import { HTTP_STATUS } from "@/utils/http-status";
import { db } from "@/db";

export const updateTaskStatus = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.uuidv7(), status: z.enum(TASK_STATUS_ENUM) }))
  .handler(
    async ({
      data,
    }): Promise<Result<null, FallbackErrorCode | NotFoundErrorCode>> => {
      const { id, status } = data;
      try {
        const [updatedTask] = await db
          .update(taskTable)
          .set({ status })
          .where(eq(taskTable.id, id))
          .returning();

        if (updatedTask) {
          return {
            success: true,
            data: null,
          };
        }

        setResponseStatus(
          HTTP_STATUS.NOT_FOUND.code,
          HTTP_STATUS.NOT_FOUND.text
        );

        return {
          success: false,
          error: {
            code: "NOT_FOUND_ERROR",
            message: "Task not found.",
            retryable: false,
          },
        };
      } catch (error) {
        const message = formatErrorMessage({
          action: `mark task as ${status}`,
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
            code: "FALLBACK_ERROR",
            message,
            retryable: false,
          },
        };
      }
    }
  );
