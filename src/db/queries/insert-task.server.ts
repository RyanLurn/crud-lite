import { SQLiteError } from "bun:sqlite";

import type { UnexpectedErrorCode, SQLiteErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import {
  type InsertedTask,
  type SelectedTask,
  taskTable,
} from "@/db/schema/tables/task";
import { db } from "@/db";

export async function insertTask(
  newTask: InsertedTask
): Promise<Result<SelectedTask, UnexpectedErrorCode | SQLiteErrorCode>> {
  try {
    const [returnedTask] = await db
      .insert(taskTable)
      .values(newTask)
      .returning();

    if (returnedTask) {
      return {
        success: true,
        data: returnedTask,
      };
    }

    return {
      success: false,
      error: {
        code: "UNEXPECTED_ERROR",
        message:
          "insertTask returns an empty result set. This isn't supposed to happen.",
        retryable: false,
      },
      context: {
        cause: null,
      },
    };
  } catch (error) {
    if (error instanceof SQLiteError) {
      return {
        success: false,
        error: {
          code: "SQLITE_ERROR",
          message: error.message,
          retryable: false,
        },
        context: { cause: error },
      };
    }

    return {
      success: false,
      error: {
        code: "UNEXPECTED_ERROR",
        message: `An unexpected error occurred while trying to insert ${newTask.name} task.`,
        retryable: false,
      },
      context: { cause: error },
    };
  }
}
