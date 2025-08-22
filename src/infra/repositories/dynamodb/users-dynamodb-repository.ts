import { User } from "../../../domain/entities/user";
import { UsersRepository } from "../../../domain/repositories/users-repository";
import { config } from "../../config/configuration";
import { DynamoDBService } from "../../services/aws/dynamodb-service";
import { DynamoDbUsersMapper } from "./mappers/dynamoDb-users-mapper";

export class UsersDynamoDbRepository implements UsersRepository {
  constructor(private readonly dynamoDbService: DynamoDBService) {}

  async create(user: User): Promise<void> {
    const userToDatabase = DynamoDbUsersMapper.domainToDatabase(user);

    await this.dynamoDbService.put(
      config.dynamoDB.usersTableName,
      userToDatabase
    );
  }

  async findByCpf(email: string): Promise<any | null> {
    const user = await this.dynamoDbService.get(
      config.dynamoDB.usersTableName,
      { email: { S: email } }
    );

    if (!user) {
      return null;
    }

    return user;
  }
}
