import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps, id } from "@/db/schema/helpers";

export const TASK_STATUS_ENUM = ["planned", "done"] as const;

export const taskTable = sqliteTable("tasks", {
  id,
  name: text("name").notNull(),
  status: text("status", { enum: TASK_STATUS_ENUM })
    .notNull()
    .default("planned"),
  ...timestamps,
});

export type SelectedTask = typeof taskTable.$inferSelect;
export type InsertedTask = typeof taskTable.$inferInsert;
