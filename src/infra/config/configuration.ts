export const config = {
  awsGeneralConfig: {
    region: String(process.env.AWS_REGION),
    accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
  },

  dynamoDB: {
    usersTableName: "users",
    attachmentsTableName: "attachments",
    endpoint: process.env.DYNAMODB_ENDPOINT,
  },

  storage: {
    attachmentsBucketName: String(process.env.AWS_S3_ATTACHMENTS_BUCKET),
    s3Endpoint: String(process.env.S3_ENDPOINT),
  },
};
