import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Uploader } from "../../domain/application/storage/uploader";
import { randomUUID } from "crypto";
import { config } from "../config/configuration";

export class S3Uploader implements Uploader {
  constructor(private readonly client: S3Client) {}

  async upload({
    fileName,
    fileType,
    body,
  }: {
    fileName: string;
    fileType: string;
    body: Buffer;
  }): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: config.storage.attachmentsBucketName,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      })
    );

    return {
      url: uniqueFileName,
    };
  }
}
