import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateAttachmentUseCase } from "../../../factories/make-create-attachment-use-case";
import { InvalidAttachmentTypeError } from "../../../../domain/application/use-cases/errors/invalid-attachment-type-error";
import { CreateAttachmentResponse } from "../dto/create-attachment-response";

export async function createAttachmentController(
  request: FastifyRequest,
  reply: FastifyReply<{
    Reply: CreateAttachmentResponse;
  }>
) {
  const data = await request.file();

  if (!data) {
    return reply.status(400).send({ message: "No file uploaded" });
  }

  const buffer = await data.toBuffer();
  const useCase = makeCreateAttachmentUseCase();

  const result = await useCase.execute({
    body: buffer,
    fileName: data.filename,
    fileType: data.mimetype,
  });

  if (result.isLeft()) {
    if (result.value instanceof InvalidAttachmentTypeError) {
      return reply.status(400).send({ message: result.value.message });
    } else {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }

  return reply.status(201).send({
    attachment: {
      id: result.value.attachment.id,
      url: result.value.attachment.url,
    },
  });
}
