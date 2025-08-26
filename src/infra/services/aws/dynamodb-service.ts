import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
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

  async query(tableName: string, indexName: string, keyCondition: any) {
    const params = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: Object.keys(keyCondition)
        .map((key) => `${key} = :${key}`)
        .join(" AND "),
      ExpressionAttributeValues: Object.keys(keyCondition).reduce(
        (acc, key) => {
          acc[`:${key}`] = keyCondition[key];
          return acc;
        },
        {} as any
      ),
    };

    const response = await this.dynamoDBClient.send(new QueryCommand(params));

    return response.Items;
  }
}
