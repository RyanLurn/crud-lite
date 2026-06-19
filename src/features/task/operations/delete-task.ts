import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import type {
  InternalServerErrorCode,
  NotFoundErrorCode,
} from "@/types/app-error";
import type { SerializableResult } from "@/types/serializable-result";

import { taskTable } from "@/db/schema/tables/task";
import { HTTP_STATUS } from "@/utils/http-status";
import { db } from "@/db";

export const deleteTask = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.uuidv7() }))
  .handler(
    async ({
      data,
    }): Promise<
      SerializableResult<null, InternalServerErrorCode | NotFoundErrorCode>
    > => {
      try {
        const [deletedTask] = await db
          .delete(taskTable)
          .where(eq(taskTable.id, data.id))
          .returning();

        if (deletedTask) {
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
        console.error(`Failed to delete task with id: ${data.id}.`);
        console.error(error);

        setResponseStatus(
          HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          HTTP_STATUS.INTERNAL_SERVER_ERROR.text
        );
        return {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete task due to an unexpected error.",
            retryable: false,
          },
        };
      }
    }
  );
