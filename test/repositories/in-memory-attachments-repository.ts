import { AttachmentsRepository } from "../../src/domain/application/repositories/attachments-repository";
import { Attachment } from "../../src/domain/entities/attachment";

export class inMemoryAttachmentsRepository implements AttachmentsRepository {
  public attachments: Attachment[] = [];

  async create(attachment: Attachment): Promise<void> {
    this.attachments.push(attachment);
  }
}
