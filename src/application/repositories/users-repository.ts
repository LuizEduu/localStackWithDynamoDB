import { User } from "../../domain/entities/user";

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findOne(cpf: string): Promise<User | null>;
}
