import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateUserUseCase } from "../../../factories/make-create-user-use-case";
import { CreateUserRequest } from "../dto/create-user-request";

export async function createUserController(
  request: FastifyRequest<{ Body: CreateUserRequest }>,
  reply: FastifyReply
) {
  const { name, email, cpf } = request.body;

  const useCase = makeCreateUserUseCase();

  const user = await useCase.execute({ name, email, cpf });

  return reply.status(201).send({
    id: user.id,
  });
}