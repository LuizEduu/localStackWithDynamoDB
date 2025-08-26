import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
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

  async scan(
    tableName: string,
    options?: {
      limit?: number;
      exclusiveStartKey?: any;
      projectionExpression?: string;
      expressionAttributeNames?: Record<string, string>;
      filterExpression?: string;
      expressionAttributeValues?: Record<string, any>;
    }
  ) {
    const params: any = {
      TableName: tableName,
    };

    if (options?.limit) {
      params.Limit = options.limit;
    }

    if (options?.exclusiveStartKey) {
      params.ExclusiveStartKey = options.exclusiveStartKey;
    }

    if (options?.projectionExpression) {
      params.ProjectionExpression = options.projectionExpression;
    }

    if (options?.expressionAttributeNames) {
      params.ExpressionAttributeNames = options.expressionAttributeNames;
    }

    if (options?.filterExpression) {
      params.FilterExpression = options.filterExpression;
    }

    if (options?.expressionAttributeValues) {
      params.ExpressionAttributeValues = options.expressionAttributeValues;
    }

    const response = await this.dynamoDBClient.send(new ScanCommand(params));

    return {
      Items: response.Items || [],
      LastEvaluatedKey: response.LastEvaluatedKey,
      Count: response.Count,
      ScannedCount: response.ScannedCount,
    };
  }
}
