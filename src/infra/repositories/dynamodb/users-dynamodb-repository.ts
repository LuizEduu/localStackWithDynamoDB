import { UsersRepository } from "../../../application/repositories/users-repository";
import { User } from "../../../domain/entities/user";
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

  async findOne(cpf: string): Promise<any | null> {
    const databaseUser = await this.dynamoDbService.query(
      config.dynamoDB.usersTableName,
      "CpfIndex",
      {
        cpf: {
          S: cpf,
        },
      }
    );

    if (!databaseUser || !databaseUser.length) {
      return null;
    }

    return DynamoDbUsersMapper.findOneDatabaseToDomain(databaseUser[0] as any);
  }
}
