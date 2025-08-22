import { User } from "../../domain/entities/user";
import { UsersRepository } from "../../domain/repositories/users-repository";
import { CreateUserRequest } from "../../infra/http/fastify/dto/create-user-request";

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, cpf }: CreateUserRequest): Promise<User> {
    const user = User.create(name, email, cpf);

    await this.usersRepository.create(user);

    return user;
  }
}
