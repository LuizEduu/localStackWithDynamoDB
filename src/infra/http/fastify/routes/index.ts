import { FastifyInstance } from "fastify";
import { createUserController } from "../controllers/create-user-controller";
import { getUserController } from "../controllers/get-user-controller";

export function routes(server: FastifyInstance): FastifyInstance {
  server.post("/users", createUserController);
  server.get("/users/:cpf", getUserController);

  return server;
}
