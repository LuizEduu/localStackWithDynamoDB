import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateUserUseCase } from "../../../factories/make-create-user-use-case";
import { CreateUserRequest } from "../dto/create-user-request";
import { UserAlreadyExistsError } from "../../../../application/use-cases/errors/user-already-exists-error";

export async function createUserController(
  request: FastifyRequest<{ Body: CreateUserRequest }>,
  reply: FastifyReply
) {
  const { name, email, cpf } = request.body;

  const useCase = makeCreateUserUseCase();

  const { isLeft, value } = await useCase.execute({
    name,
    email,
    cpf,
  });

  if (isLeft()) {
    if (value instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: value.message });
    } else {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }

  return reply.status(201).send({
    user: value,
  });
}
