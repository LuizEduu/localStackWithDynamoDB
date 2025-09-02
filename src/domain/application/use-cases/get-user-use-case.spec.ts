import { InMemoryUsersRepository } from "../../../../test/repositories/in-memory-users-repository";
import { User } from "../../entities/user";
import { GetUserUseCase } from "./get-user-use-case";
import { faker } from "@faker-js/faker";

describe("Get user use case", () => {
  let usersRepositry: InMemoryUsersRepository;
  let sut: GetUserUseCase;

  beforeEach(() => {
    usersRepositry = new InMemoryUsersRepository();
    sut = new GetUserUseCase(usersRepositry);
  });

  it("should be able to get a user", async () => {
    const user = User.create(
      faker.person.fullName(),
      faker.internet.email(),
      faker.string.numeric(11)
    );
    await usersRepositry.create(user);

    const result = await sut.execute({
      cpf: user.cpf,
    });

    expect(result.isRight()).toBe(true);
    result.isRight() && expect(result.value.user.id).toEqual(user.id);
  });

  it("should return resource not found with user not found", async () => {
    const result = await sut.execute({
      cpf: faker.string.numeric(11),
    });

    expect(result.isLeft()).toBe(true);
    result.isLeft() &&
      expect(result.value.message).toEqual("resource not found.");
  });

  it("shoud return resource not found when cpf is invalid", async () => {
    const result = await sut.execute({
      cpf: null as any,
    });

    expect(result.isLeft()).toBe(true);
    result.isLeft() &&
      expect(result.value.message).toEqual("resource not found.");
  });
});
