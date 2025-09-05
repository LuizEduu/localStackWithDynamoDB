import { S3Client } from "@aws-sdk/client-s3";
import { config } from "../configuration";

const s3Config = {
  region: config.awsGeneralConfig.region,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: config.awsGeneralConfig.accessKeyId,
    secretAccessKey: config.awsGeneralConfig.secretAccessKey,
  },
  forcePathStyle: true, // Required for LocalStack
};

const s3Client = new S3Client(s3Config);

export { s3Client };
