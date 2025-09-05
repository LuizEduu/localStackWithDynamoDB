import { FastifyRequest, FastifyReply } from "fastify";
import { createAttachmentController } from "./create-attachment-controller";
import { makeCreateAttachmentUseCase } from "../../../factories/make-create-attachment-use-case";
import { InvalidAttachmentTypeError } from "../../../../domain/application/use-cases/errors/invalid-attachment-type-error";
import { left, right } from "../../../../core/either";
import { Attachment } from "../../../../domain/entities/attachment";
import { Mock } from "vitest";

vi.mock("../../../factories/make-create-attachment-use-case");

describe("CreateAttachmentController", () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockUseCase: {
    execute: Mock;
  };

  beforeEach(() => {
    mockUseCase = {
      execute: vi.fn(),
    };

    (makeCreateAttachmentUseCase as Mock).mockReturnValue(mockUseCase);

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  it("should return 400 when no file is uploaded", async () => {
    mockRequest = {
      file: vi.fn().mockResolvedValue(null),
    };

    await createAttachmentController(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply as any
    );

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      message: "No file uploaded",
    });
  });

  it("should create attachment successfully", async () => {
    const mockFile = {
      filename: "test.jpg",
      mimetype: "image/jpeg",
      toBuffer: vi.fn().mockResolvedValue(Buffer.from("test-content")),
    };

    mockRequest = {
      file: vi.fn().mockResolvedValue(mockFile),
    };

    const attachment = Attachment.create(
      "test.jpg",
      "https://example.com/test.jpg"
    );

    mockUseCase.execute.mockResolvedValue(
      right({
        attachment,
      })
    );

    await createAttachmentController(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply as any
    );

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      body: Buffer.from("test-content"),
      fileName: "test.jpg",
      fileType: "image/jpeg",
    });

    expect(mockReply.status).toHaveBeenCalledWith(201);
    expect(mockReply.send).toHaveBeenCalledWith({
      attachment: {
        id: attachment.id,
        url: attachment.url,
      },
    });
  });

  it("should return 400 when invalid attachment type error occurs", async () => {
    const mockFile = {
      filename: "test.txt",
      mimetype: "text/plain",
      toBuffer: vi.fn().mockResolvedValue(Buffer.from("test-content")),
    };

    mockRequest = {
      file: vi.fn().mockResolvedValue(mockFile),
    };

    const error = new InvalidAttachmentTypeError("text/plain");
    mockUseCase.execute.mockResolvedValue(left(error));

    await createAttachmentController(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply as any
    );

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      message: error.message,
    });
  });

  it("should return 500 when unknown error occurs", async () => {
    const mockFile = {
      filename: "test.jpg",
      mimetype: "image/jpeg",
      toBuffer: vi.fn().mockResolvedValue(Buffer.from("test-content")),
    };

    mockRequest = {
      file: vi.fn().mockResolvedValue(mockFile),
    };

    const error = new Error("Unknown error");
    mockUseCase.execute.mockResolvedValue(left(error));

    await createAttachmentController(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply as any
    );

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });

  it("should handle file processing errors", async () => {
    const mockFile = {
      filename: "test.jpg",
      mimetype: "image/jpeg",
      toBuffer: vi.fn().mockRejectedValue(new Error("File processing error")),
    };

    mockRequest = {
      file: vi.fn().mockResolvedValue(mockFile),
    };

    await expect(
      createAttachmentController(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply as any
      )
    ).rejects.toThrow("File processing error");
  });
});
