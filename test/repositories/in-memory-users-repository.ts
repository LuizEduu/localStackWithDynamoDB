import { UsersRepository } from "../../src/domain/application/repositories/users-repository";
import { PaginationParams } from "../../src/core/pagination/pagination";
import { User } from "../../src/domain/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
  constructor(public readonly users: User[] = []) {}

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async findOne(cpf: string): Promise<User | null> {
    const user = this.users.find((user) => user.cpf === cpf);

    return user || null;
  }

  async findAll(page: number, limit: number): Promise<PaginationParams<User>> {
    const users = this.users.slice((page - 1) * limit, page * limit);

    return {
      data: users,
      totalSize: this.users.length,
      totalPages: Math.ceil(this.users.length / limit),
      currentPage: page,
      pageSize: limit,
    };
  }
}
