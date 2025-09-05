import { AttachmentsRepository } from "../../../domain/application/repositories/attachments-repository";
import { Attachment } from "../../../domain/entities/attachment";
import { config } from "../../config/configuration";
import { DynamoDBService } from "../../services/aws/dynamodb-service";
import { DynamoDbAttachmentsMapper } from "./mappers/dynamoDb-attachments-mapper";

export class AttachmentsDynamoDbRepository implements AttachmentsRepository {
  constructor(private readonly dynamoDbService: DynamoDBService) {}

  async create(attachment: Attachment): Promise<void> {
    const attachmentToDatabase =
      DynamoDbAttachmentsMapper.domainToDatabase(attachment);

    await this.dynamoDbService.put(
      config.dynamoDB.attachmentsTableName,
      attachmentToDatabase
    );
  }
}
