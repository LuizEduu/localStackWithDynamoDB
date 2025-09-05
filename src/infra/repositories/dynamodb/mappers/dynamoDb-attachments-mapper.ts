import { Attachment } from "../../../../domain/entities/attachment";

export class DynamoDbAttachmentsMapper {
  static domainToDatabase(attachment: Attachment) {
    return {
      id: { S: attachment.id },
      title: { S: attachment.title },
      url: { S: attachment.url },
    };
  }
}
