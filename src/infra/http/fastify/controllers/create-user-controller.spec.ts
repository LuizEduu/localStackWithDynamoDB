import { FastifyRequest, FastifyReply } from "fastify";
import { createUserController } from "./create-user-controller";
import { makeCreateUserUseCase } from "../../../factories/make-create-user-use-case";
import { UserAlreadyExistsError } from "../../../../domain/application/use-cases/errors/user-already-exists-error";
import { left, right } from "../../../../core/either";
import { User } from "../../../../domain/entities/user";
import { UserPresenter } from "../presenters/user-presenter";
import { faker } from "@faker-js/faker";
import { Mock } from "vitest";

vi.mock("../../../factories/make-create-user-use-case");

describe("CreateUserController", () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockUseCase: {
    execute: Mock;
  };

  beforeEach(() => {
    mockUseCase = {
      execute: vi.fn(),
    };

    (makeCreateUserUseCase as Mock).mockReturnValue(mockUseCase);

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  it("should create user successfully", async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const cpf = faker.string.numeric(11);
    const user = User.create(name, email, cpf);

    mockRequest = {
      body: { name, email, cpf },
    };

    mockUseCase.execute.mockResolvedValue(
      right({
        user,
      })
    );

    await createUserController(
      mockRequest as FastifyRequest as any,
      mockReply as FastifyReply as any
    );

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      name,
      email,
      cpf,
    });

    expect(mockReply.status).toHaveBeenCalledWith(201);
    expect(mockReply.send).toHaveBeenCalledWith({
      user: UserPresenter.toHttp(user),
    });
  });

  it("should return 409 when user already exists", async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const cpf = faker.string.numeric(11);

    mockRequest = {
      body: { name, email, cpf },
    };

    const error = new UserAlreadyExistsError();
    mockUseCase.execute.mockResolvedValue(left(error));

    await createUserController(
      mockRequest as FastifyRequest as any,
      mockReply as FastifyReply as any
    );

    expect(mockReply.status).toHaveBeenCalledWith(409);
    expect(mockReply.send).toHaveBeenCalledWith({
      message: error.message,
    });
  });

  it("should return 500 when unknown error occurs", async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const cpf = faker.string.numeric(11);

    mockRequest = {
      body: { name, email, cpf },
    };

    const error = new Error("Unknown error");
    mockUseCase.execute.mockResolvedValue(left(error));

    await createUserController(
      mockRequest as FastifyRequest as any,
      mockReply as FastifyReply as any
    );

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
