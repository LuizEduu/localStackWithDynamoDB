import Fastify, { FastifyInstance } from "fastify";

import { validateEnv } from "../../config/env-validation";
import fastifySensible from "@fastify/sensible";
import { routes } from "./routes";

let envConfig: Record<string, any>;
try {
  envConfig = validateEnv();
  console.log("✅ Environment variables validated successfully");
} catch (error: any) {
  console.error(`❌ Environment validation failed: ${error.message}`);
  process.exit(1);
}

let server: FastifyInstance = Fastify({
  logger: true,
});

server = routes(server);
server.register(fastifySensible);

export { server, envConfig };
