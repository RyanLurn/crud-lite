import { SQLiteError } from "bun:sqlite";

import type { UnexpectedDatabaseErrorCode } from "@/db/types";
import type { UnexpectedErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import { taskTable } from "@/db/schema/tables/task";
import { db } from "@/db";

export async function insertTask(
  name: string
): Promise<Result<string, UnexpectedDatabaseErrorCode | UnexpectedErrorCode>> {
  try {
    const id = Bun.randomUUIDv7();
    await db.insert(taskTable).values({ id, name }).returning();
    return {
      success: true,
      data: id,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code:
          error instanceof SQLiteError
            ? "UNEXPECTED_DATABASE_ERROR"
            : "UNEXPECTED_ERROR",
        message: `Something went wrong while trying to insert ${name} task.`,
        retryable: false,
      },
      context: { cause: error },
    };
  }
}
