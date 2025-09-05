import { FastifyInstance } from "fastify";
import { createUserController } from "../controllers/create-user-controller";
import { getUserController } from "../controllers/get-user-controller";
import { fetchUsersController } from "../controllers/fetch-users-controller";
import { createAttachmentController } from "../controllers/create-attachment-controller";

export function routes(server: FastifyInstance): FastifyInstance {
  server.post("/users", createUserController as any);
  server.get("/users/:cpf", getUserController as any);
  server.get("/users", fetchUsersController as any);
  server.post("/upload", createAttachmentController as any);

  return server;
}
