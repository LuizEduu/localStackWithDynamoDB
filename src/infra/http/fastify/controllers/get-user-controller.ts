import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserUseCase } from "../../../factories/make-get-user-use-case";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found";
import { UserPresenter } from "../presenters/user-presenter";
import { GetUserResponse } from "../dto/get-user-response";
import { GetUserRequest } from "../dto/get-user-request";

export async function getUserController(
  request: FastifyRequest<{ Params: GetUserRequest }>,
  reply: FastifyReply<{
    Reply: GetUserResponse;
  }>
) {
  const { cpf } = request.params;

  const useCase = makeGetUserUseCase();

  const result = await useCase.execute({
    cpf,
  });

  if (result.isLeft()) {
    if (result.value instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: result.value.message });
    } else {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }

  return reply.status(200).send({
    user: UserPresenter.toHttp(result.value.user),
  });
}
