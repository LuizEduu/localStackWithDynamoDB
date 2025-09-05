import { FastifyRequest, FastifyReply } from "fastify";
import { getUserController } from "./get-user-controller";
import { makeGetUserUseCase } from "../../../factories/make-get-user-use-case";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found";
import { left, right } from "../../../../core/either";
import { User } from "../../../../domain/entities/user";
import { UserPresenter } from "../presenters/user-presenter";
import { faker } from "@faker-js/faker";
import { Mock } from "vitest";

vi.mock("../../../factories/make-get-user-use-case");

describe("GetUserController", () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockUseCase: {
    execute: Mock;
  };

  beforeEach(() => {
    mockUseCase = {
      execute: vi.fn(),
    };

    (makeGetUserUseCase as Mock).mockReturnValue(mockUseCase);

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  it("should get user successfully", async () => {
    const cpf = faker.string.numeric(11);
    const user = User.create(
      faker.person.fullName(),
      faker.internet.email(),
      cpf
    );

    mockRequest = {
      params: { cpf },
    };

    mockUseCase.execute.mockResolvedValue(
      right({
        user,
      })
    );

    await getUserController(
      mockRequest as FastifyRequest as any,
      mockReply as FastifyReply as any
    );

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      cpf,
    });

    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith({
      user: UserPresenter.toHttp(user),
    });
  });

  it("should return 404 when user not found", async () => {
    const cpf = faker.string.numeric(11);

    mockRequest = {
      params: { cpf },
    };

    const error = new ResourceNotFoundError();
    mockUseCase.execute.mockResolvedValue(left(error));

    await getUserController(
      mockRequest as FastifyRequest as any,
      mockReply as FastifyReply as any
    );

    expect(mockReply.status).toHaveBeenCalledWith(404);
    expect(mockReply.send).toHaveBeenCalledWith({
      message: error.message,
    });
  });

  it("should return 500 when unknown error occurs", async () => {
    const cpf = faker.string.numeric(11);

    mockRequest = {
      params: { cpf },
    };

    const error = new Error("Unknown error");
    mockUseCase.execute.mockResolvedValue(left(error));

    await getUserController(
      mockRequest as FastifyRequest as any,
      mockReply as FastifyReply as any
    );

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
