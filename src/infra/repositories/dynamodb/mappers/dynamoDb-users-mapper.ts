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

  static findOneDatabaseToDomain(user: findOneDatabaseToDomainUser): User {
    return User.create(user.cpf.S, user.name.S, user.email.S, user.id.S);
  }
}
