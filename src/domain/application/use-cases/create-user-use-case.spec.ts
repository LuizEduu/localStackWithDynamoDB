import { makeCreateUserUseCaseTest } from "../../../../test/factories/make-create-user-use-case-test";
import { InMemoryUsersRepository } from "../../../../test/repositories/in-memory-users-repository";
import { User } from "../../entities/user";
import { CreateUserUseCase } from "./create-user-use-case";
import { faker } from "@faker-js/faker";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("CreateUserUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: CreateUserUseCase;

  beforeEach(() => {
    const { createUserUseCase, inMemoryUsersRepository } =
      makeCreateUserUseCaseTest();

    sut = createUserUseCase;
    usersRepository = inMemoryUsersRepository;
  });

  it("should be able to create a new user", async () => {
    const cpf = faker.string.numeric(11);
    const result = await sut.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf,
    });

    expect(result.isRight()).toBe(true);
    expect(usersRepository.users[0].cpf).toEqual(cpf);
  });

  it("should not be able to create a new user with the same cpf", async () => {
    const cpf = faker.string.numeric(11);
    await usersRepository.create(
      User.create(faker.person.fullName(), faker.internet.email(), cpf)
    );

    const result = await sut.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
