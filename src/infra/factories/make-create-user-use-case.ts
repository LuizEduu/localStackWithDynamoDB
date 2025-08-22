import { CreateUserUseCase } from "../../application/use-cases/create-user-use-case";
import { dynamoDBClient } from "../config/aws/dynamodb-config";
import { UsersDynamoDbRepository } from "../repositories/dynamodb/users-dynamodb-repository";
import { DynamoDBService } from "../services/aws/dynamodb-service";

export function makeCreateUserUseCase() {
  const awsService = new DynamoDBService(dynamoDBClient);
  const repository = new UsersDynamoDbRepository(awsService);
  const useCase = new CreateUserUseCase(repository);
  return useCase;
}
