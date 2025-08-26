import { FastifyRequest, FastifyReply } from "fastify";
import { UserPresenter } from "../presenters/user-presenter";
import { FetchUsersRequest } from "../dto/fetch-users-request";
import { FetchUsersResponse } from "../dto/fetch-users-response";
import { makeFetchUsersUseCase } from "../../../factories/make-fetch-users-use-case";

export async function fetchUsersController(
  request: FastifyRequest<{
    Querystring: FetchUsersRequest;
  }>,
  reply: FastifyReply<{
    Reply: FetchUsersResponse;
  }>
) {
  const { page, limit } = request.query;
  const useCase = makeFetchUsersUseCase();

  const result = await useCase.execute({
    page,
    limit,
  });

  if (result.isLeft()) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }

  return reply.status(200).send({
    data: result.value.data.map(UserPresenter.toHttp),
    currentPage: result.value.currentPage,
    pageSize: result.value.pageSize,
    totalPages: result.value.totalPages,
    totalSize: result.value.totalSize,
  });
}
