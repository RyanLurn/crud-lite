import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { serializeError } from "serialize-error";

import type { SuccessResult, ErrorResult, Result } from "@/types/result";
import type { FallbackErrorCode } from "@/types/app-error";

import { type SelectedTask, taskTable } from "@/db/schema/tables/task";
import { formatErrorMessage } from "@/utils/format-error-message";
import { HTTP_STATUS } from "@/utils/http-status";
import { logger } from "@/lib/pino/logger";
import { db } from "@/db";

export const listTasks = createServerFn().handler(
  async (): Promise<Result<SelectedTask[], FallbackErrorCode>> => {
    try {
      const tasks = await db.select().from(taskTable);

      const successResult: SuccessResult<SelectedTask[]> = {
        success: true,
        data: tasks,
      };

      logger.trace(
        successResult,
        `Selected ${tasks.length} task(s) from the database.`
      );

      return successResult;
    } catch (error) {
      setResponseStatus(
        HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
        HTTP_STATUS.INTERNAL_SERVER_ERROR.text
      );

      const errorMessage = formatErrorMessage({
        action: "select tasks",
        reason: "an unexpected error",
      });
      const errorResult: ErrorResult<FallbackErrorCode> = {
        success: false,
        error: {
          code: "FALLBACK_ERROR",
          message: errorMessage,
          retryable: false,
        },
      };

      logger.error(
        { ...errorResult, cause: serializeError(error) },
        errorMessage
      );

      return errorResult;
    }
  }
);
