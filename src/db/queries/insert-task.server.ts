import { type InsertedTask, taskTable } from "@/db/schema/tables/task";
import { db } from "@/db";

export async function insertTask(newTask: InsertedTask) {
  const [returnedTask] = await db.insert(taskTable).values(newTask).returning();
  return returnedTask;
}
