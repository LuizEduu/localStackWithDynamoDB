import { randomUUID } from "crypto";
import { User } from "./user";
import { faker } from "@faker-js/faker";

describe("User entity", () => {
  it("should create a new user", () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const cpf = faker.string.numeric(11);
    const id = randomUUID();

    const user = User.create(name, email, cpf, id);

    expect(user.id).toBe(id);
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.cpf).toBe(cpf);
  });

  it("should be able to create a new user with new id", () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const cpf = faker.string.numeric(11);

    const user = User.create(name, email, cpf);

    expect(user.id).toBeDefined();
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.cpf).toBe(cpf);
  });
});
