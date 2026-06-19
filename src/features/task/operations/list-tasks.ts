import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";

import type { SerializableResult } from "@/types/serializable-result";
import type { InternalServerErrorCode } from "@/types/app-error";

import { type SelectedTask, taskTable } from "@/db/schema/tables/task";
import { HTTP_STATUS } from "@/utils/http-status";
import { db } from "@/db";

export const listTasks = createServerFn().handler(
  async (): Promise<
    SerializableResult<SelectedTask[], InternalServerErrorCode>
  > => {
    try {
      const tasks = await db.select().from(taskTable);
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error(
        `Something went wrong while trying to select tasks from the database:`
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
          message: "Something went wrong while trying to list tasks.",
          retryable: false,
        },
      };
    }
  }
);
