import { left, right } from "../../core/either";
import { ResourceNotFoundError } from "../../core/errors/resource-not-found";
import { UsersRepository } from "../repositories/users-repository";
import { GetUserUseCaseRequest } from "./dto/get-user-request-use-case";
import { GetUserUseCaseResponse } from "./dto/get-user-response-use-case";

export class GetUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    cpf,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findOne(cpf);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    return right({
      user,
    });
  }
}
