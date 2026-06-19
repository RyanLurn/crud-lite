import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { logger } from "@/lib/pino/logger";
import { env } from "@/config/env.server";

// Making sure that the env module is loaded before most other modules.
logger.info(`[ENV] Server started in ${env.NODE_ENV} environment.`);

export default createServerEntry({
  fetch(request) {
    return handler.fetch(request);
  },
});
