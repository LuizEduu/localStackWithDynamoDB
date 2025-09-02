import { InMemoryUsersRepository } from "../../../../test/repositories/in-memory-users-repository";
import { User } from "../../entities/user";
import { FetchUsersUseCase } from "./fetch-users-use-case";
import { faker } from "@faker-js/faker";

describe("Fetch users use case", () => {
  let usersRepositry: InMemoryUsersRepository;
  let sut: FetchUsersUseCase;

  beforeEach(() => {
    usersRepositry = new InMemoryUsersRepository();
    sut = new FetchUsersUseCase(usersRepositry);
  });

  it("should be able to fetch users", async () => {
    for (let i = 0; i < 20; i++) {
      const user = User.create(
        faker.person.fullName(),
        faker.internet.email(),
        faker.string.numeric(11)
      );

      await usersRepositry.create(user);
    }

    const result = await sut.execute({
      page: 1,
      limit: 10,
    });

    expect(result.isRight()).toBe(true);
    result.isRight() && expect(result.value.data).toHaveLength(10);
  });

  it("should be able to paginate users", async () => {
    for (let i = 0; i < 15; i++) {
      const user = User.create(
        faker.person.fullName(),
        faker.internet.email(),
        faker.string.numeric(11)
      );

      await usersRepositry.create(user);
    }

    const result = await sut.execute({
      page: 2,
      limit: 10,
    });

    expect(result.isRight()).toBe(true);
    result.isRight() && expect(result.value.data).toHaveLength(5);
  });

  it("shoud be able to return empty list with no users", async () => {
    const result = await sut.execute({
      page: 1,
      limit: 10,
    });

    expect(result.isRight()).toBe(true);
    result.isRight() && expect(result.value.data).toHaveLength(0);
  });
});
