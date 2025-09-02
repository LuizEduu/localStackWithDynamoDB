import { FetchUsersUseCase } from "../../src/domain/application/use-cases/fetch-users-use-case";
import { InMemoryUsersRepository } from "../repositories/in-memory-users-repository";

export function makeFetchUsersUseCase() {
  const inMemoryUsersRepository = new InMemoryUsersRepository();
  const createUserUseCase = new FetchUsersUseCase(inMemoryUsersRepository);

  return {
    inMemoryUsersRepository,
    createUserUseCase,
  };
}
