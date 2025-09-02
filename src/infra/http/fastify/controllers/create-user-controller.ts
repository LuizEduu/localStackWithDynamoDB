import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateUserUseCase } from "../../../factories/make-create-user-use-case";
import { CreateUserRequest } from "../dto/create-user-request";
import { UserAlreadyExistsError } from "../../../../domain/application/use-cases/errors/user-already-exists-error";
import { CreateUserResponse } from "../dto/create-user-response";
import { UserPresenter } from "../presenters/user-presenter";

export async function createUserController(
  request: FastifyRequest<{ Body: CreateUserRequest }>,
  reply: FastifyReply<{
    Reply: CreateUserResponse;
  }>
) {
  const { name, email, cpf } = request.body;

  const useCase = makeCreateUserUseCase();

  const result = await useCase.execute({
    name,
    email,
    cpf,
  });

  if (result.isLeft()) {
    if (result.value instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: result.value.message });
    } else {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }

  return reply.status(201).send({
    user: UserPresenter.toHttp(result.value.user),
  });
}
