import { z } from "zod";

const envValidator = z.object({
  NODE_ENV: z.enum(["development", "testing", "staging", "production"]),
});

export const env = envValidator.parse(process.env);
