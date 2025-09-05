import { FastifyRequest, FastifyReply } from "fastify";
import { fetchUsersController } from "./fetch-users-controller";
import { makeFetchUsersUseCase } from "../../../factories/make-fetch-users-use-case";
import { left, right } from "../../../../core/either";
import { User } from "../../../../domain/entities/user";
import { UserPresenter } from "../presenters/user-presenter";
import { faker } from "@faker-js/faker";
import { Mock } from "vitest";

vi.mock("../../../factories/make-fetch-users-use-case");

describe("FetchUsersController", () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockUseCase: {
    execute: Mock;
  };

  beforeEach(() => {
    mockUseCase = {
      execute: vi.fn(),
    };

    (makeFetchUsersUseCase as Mock).mockReturnValue(mockUseCase);

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  it("should fetch users successfully", async () => {
    const page = 1;
    const limit = 10;
    const users = Array.from({ length: 3 }, () =>
      User.create(
        faker.person.fullName(),
        faker.internet.email(),
        faker.string.numeric(11)
      )
    );

    mockRequest = {
      query: { page, limit },
    };

    mockUseCase.execute.mockResolvedValue(
      right({
        data: users,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalSize: 3,
      })
    );

    await fetchUsersController(
      mockRequest as FastifyRequest as any,
      mockReply as FastifyReply as any
    );

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      page,
      limit,
    });

    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith({
      data: users.map(UserPresenter.toHttp),
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalSize: 3,
    });
  });

  it("should return 500 when error occurs", async () => {
    const page = 1;
    const limit = 10;

    mockRequest = {
      query: { page, limit },
    };

    const error = new Error("Database error");
    mockUseCase.execute.mockResolvedValue(left(error));

    await fetchUsersController(
      mockRequest as FastifyRequest as any,
      mockReply as FastifyReply as any
    );

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });

  it("should handle empty user list", async () => {
    const page = 1;
    const limit = 10;

    mockRequest = {
      query: { page, limit },
    };

    mockUseCase.execute.mockResolvedValue(
      right({
        data: [],
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalSize: 0,
      })
    );

    await fetchUsersController(
      mockRequest as FastifyRequest as any,
      mockReply as FastifyReply as any
    );

    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith({
      data: [],
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalSize: 0,
    });
  });
});
