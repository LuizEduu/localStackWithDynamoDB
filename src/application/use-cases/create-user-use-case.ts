import { left, right } from "../../core/either";
import { User } from "../../domain/entities/user";
import { CreateUserRequest } from "../../infra/http/fastify/dto/create-user-request";
import { UsersRepository } from "../repositories/users-repository";
import { CreateUserResponseUseCase } from "./dto/create-user-response-use-case";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    cpf,
  }: CreateUserRequest): Promise<CreateUserResponseUseCase> {
    const userAlreadyExists = await this.usersRepository.findOne(cpf);

    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError());
    }

    const user = User.create(name, email, cpf);

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
