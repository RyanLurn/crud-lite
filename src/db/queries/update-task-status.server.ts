import { eq } from "drizzle-orm";

import type { FallbackErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import { type SelectedTask, taskTable } from "@/db/schema/tables/task";
import { db } from "@/db";

export async function updateTaskStatus({
  id,
  status,
}: Pick<SelectedTask, "status" | "id">): Promise<
  Result<null, FallbackErrorCode>
> {
  try {
    await db.update(taskTable).set({ status }).where(eq(taskTable.id, id));
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "FALLBACK_ERROR",
        message: `Something went wrong while trying to update task with id: ${id}.`,
        retryable: false,
      },
      context: { cause: error },
    };
  }
}
