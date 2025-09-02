import { Either } from "../../../../core/either";
import { User } from "../../../entities/user";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";

export type CreateUserResponseUseCase = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;
