import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { env } from "@/config/env.server";

// Making sure that the env module is loaded before most other modules.
console.log(`[ENV] Server started in ${env.NODE_ENV} environment.`);

export default createServerEntry({
  fetch(request) {
    return handler.fetch(request);
  },
});
