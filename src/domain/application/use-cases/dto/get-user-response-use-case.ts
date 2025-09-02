import { Either } from "../../../../core/either";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found";
import { User } from "../../../entities/user";

export type GetUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User;
  }
>;
