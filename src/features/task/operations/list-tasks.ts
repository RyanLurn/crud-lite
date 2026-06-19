import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";

import type { FallbackErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import { type SelectedTask, taskTable } from "@/db/schema/tables/task";
import { formatErrorMessage } from "@/utils/format-error-message";
import { HTTP_STATUS } from "@/utils/http-status";
import { db } from "@/db";

export const listTasks = createServerFn().handler(
  async (): Promise<Result<SelectedTask[], FallbackErrorCode>> => {
    try {
      const tasks = await db.select().from(taskTable);
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      const message = formatErrorMessage({
        action: "select tasks",
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
