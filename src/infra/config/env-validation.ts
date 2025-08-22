import { z } from "zod";

const envSchema = z.object({
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
  DYNAMODB_ENDPOINT: z.url("DYNAMODB_ENDPOINT must be a valid URL"),
  PORT: z
    .string()
    .default("3000")
    .transform((val) => parseInt(val, 10)),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.issues
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      throw new Error(`Environment validation failed:\n${missing}`);
    }
    throw error;
  }
}
