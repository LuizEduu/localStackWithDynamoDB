import { FetchUsersUseCase } from "../../domain/application/use-cases/fetch-users-use-case";
import { dynamoDBClient } from "../config/aws/dynamodb-config";
import { UsersDynamoDbRepository } from "../repositories/dynamodb/users-dynamodb-repository";
import { DynamoDBService } from "../services/aws/dynamodb-service";

export function makeFetchUsersUseCase() {
  const awsService = new DynamoDBService(dynamoDBClient);
  const repository = new UsersDynamoDbRepository(awsService);
  const useCase = new FetchUsersUseCase(repository);
  return useCase;
}
