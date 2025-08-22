import { User } from "../entities/user";

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findByCpf(email: string): Promise<User | null>;
}
