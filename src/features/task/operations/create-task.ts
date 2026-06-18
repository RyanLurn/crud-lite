import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { SerializableResult } from "@/types/serializable-result";
import type { InternalServerErrorCode } from "@/types/app-error";

import { insertTask } from "@/db/queries/insert-task.server";

export const taskNameValidator = z
  .string()
  .trim()
  .normalize("NFC")
  .min(1, "Task name is required.")
  .max(100, "Task name is too long.");

export const createTaskValidator = z.object({
  name: taskNameValidator,
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

        setResponseStatus(500);
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
