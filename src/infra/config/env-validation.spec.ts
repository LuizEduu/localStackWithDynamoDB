import { validateEnv } from "./env-validation";

describe("Environment Validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("should validate valid environment variables", () => {
    process.env = {
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "test-access-key",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
      DYNAMODB_ENDPOINT: "http://localhost:8000",
      PORT: "3000",
    };

    const result = validateEnv();

    expect(result).toEqual({
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "test-access-key",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
      DYNAMODB_ENDPOINT: "http://localhost:8000",
      PORT: 3000,
    });
  });

  test("should use default PORT when not provided", () => {
    process.env = {
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "test-access-key",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
      DYNAMODB_ENDPOINT: "http://localhost:8000",
    };

    const result = validateEnv();

    expect(result.PORT).toBe(3001);
  });

  test("should throw error when AWS_REGION is missing", () => {
    process.env = {
      AWS_ACCESS_KEY_ID: "test-access-key",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
      DYNAMODB_ENDPOINT: "http://localhost:8000",
    };

    expect(() => validateEnv()).toThrow("Environment validation failed:");
    expect(() => validateEnv()).toThrow("AWS_REGION: Invalid input: expected string, received undefined");
  });

  test("should throw error when AWS_ACCESS_KEY_ID is missing", () => {
    process.env = {
      AWS_REGION: "us-east-1",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
      DYNAMODB_ENDPOINT: "http://localhost:8000",
    };

    expect(() => validateEnv()).toThrow("Environment validation failed:");
    expect(() => validateEnv()).toThrow(
      "AWS_ACCESS_KEY_ID: Invalid input: expected string, received undefined"
    );
  });

  test("should throw error when AWS_SECRET_ACCESS_KEY is missing", () => {
    process.env = {
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "test-access-key",
      DYNAMODB_ENDPOINT: "http://localhost:8000",
    };

    expect(() => validateEnv()).toThrow("Environment validation failed:");
    expect(() => validateEnv()).toThrow(
      "AWS_SECRET_ACCESS_KEY: Invalid input: expected string, received undefined"
    );
  });

  test("should throw error when DYNAMODB_ENDPOINT is missing", () => {
    process.env = {
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "test-access-key",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
    };

    expect(() => validateEnv()).toThrow("Environment validation failed:");
    expect(() => validateEnv()).toThrow("DYNAMODB_ENDPOINT: DYNAMODB_ENDPOINT must be a valid URL");
  });

  test("should throw error when DYNAMODB_ENDPOINT is invalid URL", () => {
    process.env = {
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "test-access-key",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
      DYNAMODB_ENDPOINT: "invalid-url",
    };

    expect(() => validateEnv()).toThrow("Environment validation failed:");
    expect(() => validateEnv()).toThrow(
      "DYNAMODB_ENDPOINT: DYNAMODB_ENDPOINT must be a valid URL"
    );
  });

  test("should throw error when AWS_REGION is empty string", () => {
    process.env = {
      AWS_REGION: "",
      AWS_ACCESS_KEY_ID: "test-access-key",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
      DYNAMODB_ENDPOINT: "http://localhost:8000",
    };

    expect(() => validateEnv()).toThrow("AWS_REGION: AWS_REGION is required");
  });

  test("should throw error when AWS_ACCESS_KEY_ID is empty string", () => {
    process.env = {
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
      DYNAMODB_ENDPOINT: "http://localhost:8000",
    };

    expect(() => validateEnv()).toThrow(
      "AWS_ACCESS_KEY_ID: AWS_ACCESS_KEY_ID is required"
    );
  });

  test("should throw error when AWS_SECRET_ACCESS_KEY is empty string", () => {
    process.env = {
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "test-access-key",
      AWS_SECRET_ACCESS_KEY: "",
      DYNAMODB_ENDPOINT: "http://localhost:8000",
    };

    expect(() => validateEnv()).toThrow(
      "AWS_SECRET_ACCESS_KEY: AWS_SECRET_ACCESS_KEY is required"
    );
  });

  test("should convert PORT to number", () => {
    process.env = {
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "test-access-key",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
      DYNAMODB_ENDPOINT: "http://localhost:8000",
      PORT: "4000",
    };

    const result = validateEnv();

    expect(result.PORT).toBe(4000);
    expect(typeof result.PORT).toBe("number");
  });

  test("should handle multiple validation errors", () => {
    process.env = {
      AWS_REGION: "",
      DYNAMODB_ENDPOINT: "invalid-url",
    };

    expect(() => validateEnv()).toThrow("Environment validation failed:");
    expect(() => validateEnv()).toThrow("AWS_REGION: AWS_REGION is required");
    expect(() => validateEnv()).toThrow(
      "AWS_ACCESS_KEY_ID: Invalid input: expected string, received undefined"
    );
    expect(() => validateEnv()).toThrow(
      "AWS_SECRET_ACCESS_KEY: Invalid input: expected string, received undefined"
    );
    expect(() => validateEnv()).toThrow(
      "DYNAMODB_ENDPOINT: DYNAMODB_ENDPOINT must be a valid URL"
    );
  });

  test("should accept HTTPS DYNAMODB_ENDPOINT", () => {
    process.env = {
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "test-access-key",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
      DYNAMODB_ENDPOINT: "https://dynamodb.us-east-1.amazonaws.com",
    };

    const result = validateEnv();

    expect(result.DYNAMODB_ENDPOINT).toBe(
      "https://dynamodb.us-east-1.amazonaws.com"
    );
  });
});
