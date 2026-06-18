import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";

import type { SerializableResult } from "@/types/serializable-result";
import type { InternalServerErrorCode } from "@/types/app-error";
import type { SelectedTask } from "@/db/schema/tables/task";

import { selectManyTasks } from "@/db/queries/select-many-tasks.server";

export const listTasks = createServerFn().handler(
  async (): Promise<
    SerializableResult<SelectedTask[], InternalServerErrorCode>
  > => {
    const selectManyTasksResult = await selectManyTasks();

    if (!selectManyTasksResult.success) {
      console.error(selectManyTasksResult);

      setResponseStatus(500);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while trying to list tasks.",
          retryable: false,
        },
      };
    }

    return {
      success: true,
      data: selectManyTasksResult.data,
    };
  }
);
