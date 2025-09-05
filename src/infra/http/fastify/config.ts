import Fastify, { FastifyInstance } from "fastify";

import { validateEnv } from "../../config/env-validation";
import fastifySensible from "@fastify/sensible";
import { routes } from "./routes";
import fastifyMetrics from "fastify-metrics";
import multipart from "@fastify/multipart";

let envConfig: Record<string, any>;
try {
  envConfig = validateEnv();
  console.log("✅ Environment variables validated successfully");
} catch (error: any) {
  console.error(`❌ Environment validation failed: ${error.message}`);
  process.exit(1);
}

let server: FastifyInstance = Fastify({
  logger: {
    level: "info",
    serializers: {
      req(request) {
        return {
          method: request.method,
          url: request.url,
          path: request.url,
          parameters: request.params,
          headers: request.headers,
        };
      },
      res(response) {
        return {
          statusCode: response.statusCode,
        };
      },
    },
  },
});

server.register(fastifySensible);
server.register(multipart, {
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});
server = routes(server);

server.register(fastifyMetrics, {
  endpoint: "/metrics",
  routeMetrics: {
    enabled: true,
  },
});

export { server, envConfig };
