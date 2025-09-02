import { GetUserUseCase } from "../../domain/application/use-cases/get-user-use-case";
import { dynamoDBClient } from "../config/aws/dynamodb-config";
import { UsersDynamoDbRepository } from "../repositories/dynamodb/users-dynamodb-repository";
import { DynamoDBService } from "../services/aws/dynamodb-service";

export function makeGetUserUseCase() {
  const awsService = new DynamoDBService(dynamoDBClient);
  const repository = new UsersDynamoDbRepository(awsService);
  const useCase = new GetUserUseCase(repository);
  return useCase;
}
