import { SQLiteError } from "bun:sqlite";

import type {
  SQLiteBusyRecoveryErrorCode,
  SQLiteCorruptIndexErrorCode,
} from "@/db/types";
import type { UnexpectedErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import { type SelectedTask, taskTable } from "@/db/schema/tables/task";
import { env } from "@/config/env.server";
import { db } from "@/db";

export async function selectManyTasks(): Promise<
  Result<
    SelectedTask[],
    | SQLiteCorruptIndexErrorCode
    | SQLiteBusyRecoveryErrorCode
    | UnexpectedErrorCode
  >
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
        case 261: {
          if (env.SQLITE_MODE === "WRITE-AHEAD_LOG") {
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
          // This case should never happen.
          // But if it does, we fallback to the UNEXPECTED_ERROR at the end.
          break;
        }
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
