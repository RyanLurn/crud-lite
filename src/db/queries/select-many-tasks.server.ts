import { SQLiteError } from "bun:sqlite";

import type { SQLiteBusyRecoveryErrorCode } from "@/db/types";
import type { UnexpectedErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import { type SelectedTask, taskTable } from "@/db/schema/tables/task";
import { db } from "@/db";

export async function selectManyTasks(): Promise<
  Result<SelectedTask[], SQLiteBusyRecoveryErrorCode | UnexpectedErrorCode>
> {
  try {
    const tasks = await db.select().from(taskTable);
    return {
      success: true,
      data: tasks,
    };
  } catch (error) {
    if (error instanceof SQLiteError && error.errno === 261) {
      return {
        success: false,
        error: {
          code: "SQLITE_BUSY_RECOVERY_ERROR",
          message:
            "Another process is busy recovering the database file after a crash while this process is selecting tasks from the database.",
          retryable: true,
        },
        context: { cause: error },
      };
    }
    return {
      success: false,
      error: {
        code: "UNEXPECTED_ERROR",
        message:
          "An unexpected error occurred while selecting tasks from the database.",
        retryable: false,
      },
      context: { cause: error },
    };
  }
}
