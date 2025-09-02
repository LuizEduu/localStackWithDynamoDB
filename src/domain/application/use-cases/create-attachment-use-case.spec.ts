import { inMemoryAttachmentsRepository } from "../../../../test/repositories/in-memory-attachments-repository";
import { UploaderStub } from "../../../../test/stub/upload";
import { Uploader } from "../storage/uploader";
import { CreateAttachmentUseCase } from "./create-attachment-use-case";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

describe("Create attachment use case", () => {
  let uploader: Uploader;
  let attachmentsRepository: inMemoryAttachmentsRepository;
  let sut: CreateAttachmentUseCase;

  beforeEach(() => {
    uploader = new UploaderStub();
    attachmentsRepository = new inMemoryAttachmentsRepository();
    sut = new CreateAttachmentUseCase(uploader, attachmentsRepository);
  });

  it("should be able to create an attachment", async () => {
    const result = await sut.execute({
      fileName: "profile-mock",
      fileType: "jpg",
      body: Buffer.from("mocked-buffer"),
    });

    if (result.isRight()) {
      expect(result.value.attachment.id).toBeDefined();
      expect(result.value.attachment.url).toEqual("https://mockedUrl");
      expect(attachmentsRepository.attachments).toHaveLength(1);
    }
  });

  it("should not be able to create an attachment with invalid file type", async () => {
    const result = await sut.execute({
      fileName: "profile-mock",
      fileType: "pdf",
      body: Buffer.from("mocked-buffer"),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
