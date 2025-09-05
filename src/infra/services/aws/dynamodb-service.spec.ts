import { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBService } from "./dynamodb-service";
import { Mock } from "vitest";

vi.mock("@aws-sdk/client-dynamodb");

describe("DynamoDBService", () => {
  let dynamoDBService: DynamoDBService;
  let mockClient: {
    send: Mock;
  };

  beforeEach(() => {
    mockClient = {
      send: vi.fn(),
    };

    dynamoDBService = new DynamoDBService(mockClient as any);
  });

  describe("put", () => {
    it("should put item successfully", async () => {
      const tableName = "test-table";
      const item = { id: { S: "123" }, name: { S: "Test" } };

      mockClient.send.mockResolvedValue({});

      await dynamoDBService.put(tableName, item);

      expect(mockClient.send).toHaveBeenCalledWith(
        expect.any(PutItemCommand)
      );
      expect(PutItemCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Item: item,
      });
    });
  });

  describe("get", () => {
    it("should get item successfully", async () => {
      const tableName = "test-table";
      const key = { id: { S: "123" } };
      const mockItem = { id: { S: "123" }, name: { S: "Test" } };

      mockClient.send.mockResolvedValue({
        Item: mockItem,
      });

      const result = await dynamoDBService.get(tableName, key);

      expect(mockClient.send).toHaveBeenCalledWith(
        expect.any(GetItemCommand)
      );
      expect(GetItemCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Key: key,
      });
      expect(result).toEqual(mockItem);
    });

    it("should return undefined when item not found", async () => {
      const tableName = "test-table";
      const key = { id: { S: "123" } };

      mockClient.send.mockResolvedValue({});

      const result = await dynamoDBService.get(tableName, key);

      expect(result).toBeUndefined();
    });
  });

  describe("query", () => {
    it("should query items successfully", async () => {
      const tableName = "test-table";
      const indexName = "test-index";
      const keyCondition = { userId: { S: "123" } };
      const mockItems = [
        { id: { S: "1" }, userId: { S: "123" } },
        { id: { S: "2" }, userId: { S: "123" } },
      ];

      mockClient.send.mockResolvedValue({
        Items: mockItems,
      });

      const result = await dynamoDBService.query(tableName, indexName, keyCondition);

      expect(mockClient.send).toHaveBeenCalledWith(
        expect.any(QueryCommand)
      );
      expect(QueryCommand).toHaveBeenCalledWith({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": { S: "123" },
        },
      });
      expect(result).toEqual(mockItems);
    });

    it("should build query with multiple key conditions", async () => {
      const tableName = "test-table";
      const indexName = "test-index";
      const keyCondition = { 
        userId: { S: "123" },
        status: { S: "active" }
      };

      mockClient.send.mockResolvedValue({
        Items: [],
      });

      await dynamoDBService.query(tableName, indexName, keyCondition);

      expect(QueryCommand).toHaveBeenCalledWith({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: "userId = :userId AND status = :status",
        ExpressionAttributeValues: {
          ":userId": { S: "123" },
          ":status": { S: "active" },
        },
      });
    });
  });

  describe("scan", () => {
    it("should scan table successfully without options", async () => {
      const tableName = "test-table";
      const mockItems = [
        { id: { S: "1" }, name: { S: "Test1" } },
        { id: { S: "2" }, name: { S: "Test2" } },
      ];

      mockClient.send.mockResolvedValue({
        Items: mockItems,
        Count: 2,
        ScannedCount: 2,
      });

      const result = await dynamoDBService.scan(tableName);

      expect(mockClient.send).toHaveBeenCalledWith(
        expect.any(ScanCommand)
      );
      expect(ScanCommand).toHaveBeenCalledWith({
        TableName: tableName,
      });
      expect(result).toEqual({
        Items: mockItems,
        LastEvaluatedKey: undefined,
        Count: 2,
        ScannedCount: 2,
      });
    });

    it("should scan table with all options", async () => {
      const tableName = "test-table";
      const options = {
        limit: 10,
        exclusiveStartKey: { id: { S: "last-id" } },
        projectionExpression: "#n, #id",
        expressionAttributeNames: { "#n": "name", "#id": "id" },
        filterExpression: "#n = :name",
        expressionAttributeValues: { ":name": { S: "test" } },
      };

      mockClient.send.mockResolvedValue({
        Items: [],
        LastEvaluatedKey: { id: { S: "next-id" } },
        Count: 0,
        ScannedCount: 5,
      });

      const result = await dynamoDBService.scan(tableName, options);

      expect(ScanCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Limit: 10,
        ExclusiveStartKey: { id: { S: "last-id" } },
        ProjectionExpression: "#n, #id",
        ExpressionAttributeNames: { "#n": "name", "#id": "id" },
        FilterExpression: "#n = :name",
        ExpressionAttributeValues: { ":name": { S: "test" } },
      });
      expect(result).toEqual({
        Items: [],
        LastEvaluatedKey: { id: { S: "next-id" } },
        Count: 0,
        ScannedCount: 5,
      });
    });

    it("should handle empty scan result", async () => {
      const tableName = "test-table";

      mockClient.send.mockResolvedValue({
        Count: 0,
        ScannedCount: 0,
      });

      const result = await dynamoDBService.scan(tableName);

      expect(result).toEqual({
        Items: [],
        LastEvaluatedKey: undefined,
        Count: 0,
        ScannedCount: 0,
      });
    });
  });

  describe("error handling", () => {
    it("should propagate DynamoDB errors", async () => {
      const error = new Error("DynamoDB error");
      mockClient.send.mockRejectedValue(error);

      await expect(dynamoDBService.get("test-table", { id: { S: "123" } }))
        .rejects.toThrow("DynamoDB error");
    });
  });
});