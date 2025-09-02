import { right } from "../../../core/either";
import { UsersRepository } from "../repositories/users-repository";
import { FetchUsersRequestUseCase } from "./dto/fetch-users-request-use-case";
import { FetchUsersResponseUseCase } from "./dto/fetch-users-response-use-case";

export class FetchUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    page,
    limit,
  }: FetchUsersRequestUseCase): Promise<FetchUsersResponseUseCase> {
    const { data, totalPages, totalSize, currentPage, pageSize } =
      await this.usersRepository.findAll(page, limit);

    return right({
      data,
      totalPages,
      totalSize,
      currentPage,
      pageSize,
    });
  }
}
