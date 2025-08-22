import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

export class DynamoDBService {
  private dynamoDBClient: DynamoDBClient;

  constructor(dynamoDBClient: DynamoDBClient) {
    this.dynamoDBClient = dynamoDBClient;
  }

  async put(tableName: string, item: any) {
    const params = {
      TableName: tableName,
      Item: item,
    };

    await this.dynamoDBClient.send(new PutItemCommand(params));
  }

  async get(tableName: string, key: any) {
    const params = {
      TableName: tableName,
      Key: key,
    };
    const response = await this.dynamoDBClient.send(new GetItemCommand(params));

    return response.Item;
  }
}
