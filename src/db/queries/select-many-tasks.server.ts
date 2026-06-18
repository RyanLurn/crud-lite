import { SQLiteError } from "bun:sqlite";

import type { SQLiteCorruptIndexErrorCode } from "@/db/types";
import type { UnexpectedErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import { type SelectedTask, taskTable } from "@/db/schema/tables/task";
import { db } from "@/db";

export async function selectManyTasks(): Promise<
  Result<SelectedTask[], SQLiteCorruptIndexErrorCode | UnexpectedErrorCode>
> {
  try {
    const tasks = await db.select().from(taskTable);
    return {
      success: true,
      data: tasks,
    };
  } catch (error) {
    if (error instanceof SQLiteError) {
      switch (error.errno) {
        // SQLITE_CORRUPT_INDEX
        case 779: {
          return {
            success: false,
            error: {
              code: "SQLITE_CORRUPT_INDEX_ERROR",
              message:
                "SQLite detected an entry is missing from an index while selecting tasks from the database.",
              retryable: false,
            },
            context: { cause: error },
          };
        }
      }
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
