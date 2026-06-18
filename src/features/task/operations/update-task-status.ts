import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { SerializableResult } from "@/types/serializable-result";
import type { InternalServerErrorCode } from "@/types/app-error";

import { updateTaskStatus as updateTaskStatusQuery } from "@/db/queries/update-task-status.server";
import { TASK_STATUS_ENUM } from "@/db/schema/tables/task";

export const updateTaskStatus = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.uuidv7(), status: z.enum(TASK_STATUS_ENUM) }))
  .handler(
    async ({
      data,
    }): Promise<SerializableResult<null, InternalServerErrorCode>> => {
      const updateTaskStatusQueryResult = await updateTaskStatusQuery(data);

      if (!updateTaskStatusQueryResult.success) {
        console.error(updateTaskStatusQueryResult);

        setResponseStatus(500);
        return {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: `Something went wrong while trying to mark task as ${data.status}.`,
            retryable: false,
          },
        };
      }

      return {
        success: true,
        data: null,
      };
    }
  );
