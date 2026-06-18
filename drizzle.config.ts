import { defineConfig } from "drizzle-kit";

import { env } from "@/config/env.server";

export default defineConfig({
  dbCredentials: {
    url: env.SQLITE_FILE_PATH,
  },
  schema: "./src/db/schema/tables",
  out: "./migrations",
  dialect: "sqlite",
});
