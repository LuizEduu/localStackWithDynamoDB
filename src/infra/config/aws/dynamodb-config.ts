import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { config } from "../configuration";

const dynamoConfig = {
  region: config.dynamoDB.region,
  endpoint: config.dynamoDB.endpoint,
  credentials: {
    accessKeyId: config.dynamoDB.accessKeyId,
    secretAccessKey: config.dynamoDB.secretAccessKey,
  },
};

const dynamoDBClient = new DynamoDBClient(dynamoConfig);

export { dynamoDBClient };
