import { SQLiteError } from "bun:sqlite";

import type { UnexpectedDatabaseErrorCode } from "@/db/types";
import type { UnexpectedErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import { type SelectedTask, taskTable } from "@/db/schema/tables/task";
import { db } from "@/db";

export async function selectManyTasks(): Promise<
  Result<SelectedTask[], UnexpectedDatabaseErrorCode | UnexpectedErrorCode>
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
        code:
          error instanceof SQLiteError
            ? "UNEXPECTED_DATABASE_ERROR"
            : "UNEXPECTED_ERROR",
        message:
          "An unexpected error occurred while selecting tasks from the database.",
        retryable: false,
      },
      context: { cause: error },
    };
  }
}
