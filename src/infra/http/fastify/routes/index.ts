import { FastifyInstance } from "fastify";
import { createUserController } from "../controllers/create-user-controller";

export function routes(server: FastifyInstance): FastifyInstance {
  server.post("/users", createUserController);

  return server;
}
