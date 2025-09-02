import { Either } from "../../../../core/either";
import { InvalidAttachmentTypeError } from "../errors/invalid-attachment-type-error";

export type CreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: {
      id: string;
      url: string;
    };
  }
>;
