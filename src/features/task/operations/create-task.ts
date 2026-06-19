import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { SerializableResult } from "@/types/serializable-result";
import type { InternalServerErrorCode } from "@/types/app-error";

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
    async ({
      data,
    }): Promise<SerializableResult<string, InternalServerErrorCode>> => {
      try {
        const id = Bun.randomUUIDv7();
        await db.insert(taskTable).values({ id, name: data.name });

        setResponseStatus(HTTP_STATUS.CREATED.code, HTTP_STATUS.CREATED.text);
        return {
          success: true,
          data: id,
        };
      } catch (error) {
        console.error(
          `Something went wrong while trying to create ${data.name} task:`
        );
        console.error(error);

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
    }
  );
