import { User } from "../../../../domain/entities/user";

type findOneDatabaseToDomainUser = {
  name: { S: string };
  cpf: { S: string };
  id: { S: string };
  email: { S: string };
};

export class DynamoDbUsersMapper {
  static domainToDatabase(user: User) {
    return {
      id: { S: user.id },
      name: { S: user.name },
      email: { S: user.email },
      cpf: { S: user.cpf },
    };
  }

  static databaseToDomain(user: findOneDatabaseToDomainUser): User {
    return User.create(user.name.S, user.email.S, user.cpf.S, user.id.S);
  }
}
