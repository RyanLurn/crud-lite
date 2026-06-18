import type { FallbackErrorCode } from "@/types/app-error";
import type { Result } from "@/types/result";

import { taskTable } from "@/db/schema/tables/task";
import { db } from "@/db";

export async function insertTask(
  name: string
): Promise<Result<string, FallbackErrorCode>> {
  try {
    const id = Bun.randomUUIDv7();
    await db.insert(taskTable).values({ id, name });
    return {
      success: true,
      data: id,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "FALLBACK_ERROR",
        message: `Something went wrong while trying to insert ${name} task.`,
        retryable: false,
      },
      context: { cause: error },
    };
  }
}
