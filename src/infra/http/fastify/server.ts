import Fastify, { FastifyInstance } from "fastify";
import sensible from "@fastify/sensible";
import { createUserController } from "./controllers/create-user-controller";
import { validateEnv } from "../../config/env-validation";

// Validar variáveis de ambiente antes de inicializar qualquer coisa
let envConfig: Record<string, any>;
try {
  envConfig = validateEnv();
  console.log("✅ Environment variables validated successfully");
} catch (error: any) {
  console.error("❌ Environment validation failed:");
  console.error(error.message);
  process.exit(1);
}

const server: FastifyInstance = Fastify({
  logger: true,
});

server.register(sensible);

server.post("/users", createUserController);

const start = async () => {
  try {
    await server.listen({ port: envConfig.PORT });

    console.log(`🚀 HTTP server is running on port ${envConfig.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
