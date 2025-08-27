import { CreateUserUseCase } from "../../src/application/use-cases/create-user-use-case";
import { InMemoryUsersRepository } from "../repositories/in-memory-users-repository";

export function makeCreateUserUseCaseTest() {
  const inMemoryUsersRepository = new InMemoryUsersRepository();
  const createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

  return {
    inMemoryUsersRepository,
    createUserUseCase,
  };
}
