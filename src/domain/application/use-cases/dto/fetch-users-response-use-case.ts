import { Either } from "../../../../core/either";
import { PaginationParams } from "../../../../core/pagination/pagination";
import { User } from "../../../entities/user";

export type FetchUsersResponseUseCase = Either<null, PaginationParams<User>>;
