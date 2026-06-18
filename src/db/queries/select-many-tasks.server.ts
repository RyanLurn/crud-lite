import type { FallbackErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import { type SelectedTask, taskTable } from "@/db/schema/tables/task";
import { db } from "@/db";

export async function selectManyTasks(): Promise<
  Result<SelectedTask[], FallbackErrorCode>
> {
  try {
    const tasks = await db.select().from(taskTable);
    return {
      success: true,
      data: tasks,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "FALLBACK_ERROR",
        message:
          "An unexpected error occurred while selecting tasks from the database.",
        retryable: false,
      },
      context: { cause: error },
    };
  }
}
