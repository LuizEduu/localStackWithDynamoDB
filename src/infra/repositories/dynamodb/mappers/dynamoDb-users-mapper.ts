import { User } from "../../../../domain/entities/user";

export class DynamoDbUsersMapper {
  static domainToDatabase(user: User) {
    return {
      id: { S: user.id },
      name: { S: user.name },
      email: { S: user.email },
      cpf: { S: user.cpf },
    };
  }
}
