import { CreateAttachmentUseCase } from "../../domain/application/use-cases/create-attachment-use-case";
import { dynamoDBClient } from "../config/aws/dynamodb-config";
import { s3Client } from "../config/aws/s3-config";
import { AttachmentsDynamoDbRepository } from "../repositories/dynamodb/attachments-dynamodb-repository";
import { DynamoDBService } from "../services/aws/dynamodb-service";
import { S3Uploader } from "../storage/s3-storage";

export function makeCreateAttachmentUseCase() {
  const awsService = new DynamoDBService(dynamoDBClient);
  const repository = new AttachmentsDynamoDbRepository(awsService);
  const uploader = new S3Uploader(s3Client);
  const useCase = new CreateAttachmentUseCase(uploader, repository);

  return useCase;
}
