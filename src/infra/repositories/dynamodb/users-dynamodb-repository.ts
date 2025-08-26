import { UsersRepository } from "../../../application/repositories/users-repository";
import { PaginationParams } from "../../../core/pagination/pagination";
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

    return DynamoDbUsersMapper.databaseToDomain(databaseUser[0] as any);
  }

  async findAll(
    page?: number,
    limit?: number
  ): Promise<PaginationParams<User>> {
    const pageSize = limit || 10;

    // Fazer um scan para contar o total de itens na tabela (sem limit)
    let totalItems = 0;
    let lastEvaluatedKey = undefined;

    do {
      const countResult = await this.dynamoDbService.scan(
        config.dynamoDB.usersTableName,
        {
          projectionExpression: "id",
          exclusiveStartKey: lastEvaluatedKey,
        }
      );

      totalItems += countResult.Count || 0;
      lastEvaluatedKey = countResult.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    const result = await this.dynamoDbService.scan(
      config.dynamoDB.usersTableName,
      {
        limit: pageSize,
      }
    );

    const users =
      result.Items && result.Items.length > 0
        ? result.Items.map((item) =>
            DynamoDbUsersMapper.databaseToDomain(item as any)
          )
        : [];

    const currentPage = page || 1;
    const totalSize = totalItems;
    const totalPages = Math.ceil(totalSize / pageSize);

    return {
      data: users,
      totalPages,
      totalSize,
      currentPage: Number(currentPage),
      pageSize: Number(pageSize),
    };
  }
}
