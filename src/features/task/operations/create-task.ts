import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { SerializableResult } from "@/types/serializable-result";
import type { InternalServerErrorCode } from "@/types/app-error";

import { insertTask } from "@/db/queries/insert-task.server";
import { HTTP_STATUS } from "@/utils/http-status";

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
    async ({
      data,
    }): Promise<SerializableResult<string, InternalServerErrorCode>> => {
      const insertTaskResult = await insertTask(data.name);

      if (!insertTaskResult.success) {
        console.error(insertTaskResult);

        setResponseStatus(
          HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          HTTP_STATUS.INTERNAL_SERVER_ERROR.text
        );
        return {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: `Something went wrong while trying to create ${data.name} task.`,
            retryable: false,
          },
        };
      }

      return {
        success: true,
        data: insertTaskResult.data,
      };
    }
  );
