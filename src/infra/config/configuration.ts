export const config = {
  dynamoDB: {
    region: String(process.env.AWS_REGION),
    accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
    usersTableName: "users",
    endpoint: process.env.DYNAMODB_ENDPOINT,
  },
};
