import { SQLiteError } from "bun:sqlite";

import type { UnexpectedDatabaseErrorCode } from "@/db/types";
import type { UnexpectedErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import {
  type InsertedTask,
  type SelectedTask,
  taskTable,
} from "@/db/schema/tables/task";
import { db } from "@/db";

export async function insertTask(
  newTask: InsertedTask
): Promise<
  Result<SelectedTask, UnexpectedDatabaseErrorCode | UnexpectedErrorCode>
> {
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

    throw new Error(
      "insertTask returns an empty result set. This isn't supposed to happen."
    );
  } catch (error) {
    return {
      success: false,
      error: {
        code:
          error instanceof SQLiteError
            ? "UNEXPECTED_DATABASE_ERROR"
            : "UNEXPECTED_ERROR",
        message: `Something went wrong while trying to insert ${newTask.name} task.`,
        retryable: false,
      },
      context: { cause: error },
    };
  }
}
