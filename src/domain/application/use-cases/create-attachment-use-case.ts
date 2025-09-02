import { left, right } from "../../../core/either";
import { Attachment } from "../../entities/attachment";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { Uploader } from "../storage/uploader";
import { CreateAttachmentUseCaseRequest } from "./dto/create-attachment-request-use-case";
import { CreateAttachmentUseCaseResponse } from "./dto/create-attachment-response-use-case";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

export class CreateAttachmentUseCase {
  constructor(
    private readonly uploader: Uploader,
    private readonly attachmentsRepository: AttachmentsRepository
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: CreateAttachmentUseCaseRequest): Promise<CreateAttachmentUseCaseResponse> {
    if (!/^image\/(jpeg|jpg|png)$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const attachment = Attachment.create(fileName, url);

    await this.attachmentsRepository.create(attachment);

    return right({
      attachment,
    });
  }
}
