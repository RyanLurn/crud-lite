import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps, id } from "@/db/schema/helpers";

export const taskTable = sqliteTable("tasks", {
  id,
  name: text("name").notNull(),
  status: text("status", { enum: ["planned", "done"] })
    .notNull()
    .default("planned"),
  ...timestamps,
});
