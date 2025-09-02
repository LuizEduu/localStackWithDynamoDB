import { GetUserUseCase } from "../../src/domain/application/use-cases/get-user-use-case";
import { InMemoryUsersRepository } from "../repositories/in-memory-users-repository";

export function makeGetUserUseCase() {
  const inMemoryUsersRepository = new InMemoryUsersRepository();
  const createUserUseCase = new GetUserUseCase(inMemoryUsersRepository);

  return {
    inMemoryUsersRepository,
    createUserUseCase,
  };
}
