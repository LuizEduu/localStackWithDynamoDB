import Fastify, { FastifyInstance } from "fastify";
import sensible from "@fastify/sensible";
import { createUserController } from "./controllers/create-user-controller";

const server: FastifyInstance = Fastify({
  logger: true,
});

server.register(sensible);

server.post("/users", createUserController);

const start = async () => {
  try {
    await server.listen({ port: 3000 });

    console.log("http server is running");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
