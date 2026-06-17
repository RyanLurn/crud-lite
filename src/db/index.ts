import { drizzle } from "drizzle-orm/bun-sqlite";

import { taskTable } from "@/db/schema/tables/task";
import { env } from "@/config/env.server";

export const db = drizzle(env.SQLITE_FILE_PATH, {
  schema: { taskTable },
});
