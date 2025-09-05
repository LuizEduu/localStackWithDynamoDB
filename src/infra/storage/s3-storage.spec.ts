import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Uploader } from "./s3-storage";
import { config } from "../config/configuration";
import { faker } from "@faker-js/faker";
import { Mock } from "vitest";

vi.mock("@aws-sdk/client-s3");
vi.mock("../config/configuration", () => ({
  config: {
    storage: {
      attachmentsBucketName: "test-bucket",
    },
  },
}));

vi.mock("crypto", () => ({
  randomUUID: vi.fn(() => "mocked-uuid-123"),
}));

describe("S3Uploader", () => {
  let s3Uploader: S3Uploader;
  let mockClient: {
    send: Mock;
  };

  beforeEach(() => {
    mockClient = {
      send: vi.fn(),
    };

    s3Uploader = new S3Uploader(mockClient as any);
  });

  describe("upload", () => {
    it("should upload file successfully", async () => {
      const fileName = "test-image.jpg";
      const fileType = "image/jpeg";
      const body = Buffer.from("test-file-content");

      mockClient.send.mockResolvedValue({});

      const result = await s3Uploader.upload({
        fileName,
        fileType,
        body,
      });

      expect(mockClient.send).toHaveBeenCalledWith(
        expect.any(PutObjectCommand)
      );
      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: "test-bucket",
        Key: "mocked-uuid-123-test-image.jpg",
        ContentType: "image/jpeg",
        Body: body,
      });
      expect(result).toEqual({
        url: "mocked-uuid-123-test-image.jpg",
      });
    });

    it("should generate unique filename with UUID prefix", async () => {
      const fileName = faker.system.fileName();
      const fileType = faker.system.mimeType();
      const body = Buffer.from(faker.lorem.text());

      mockClient.send.mockResolvedValue({});

      const result = await s3Uploader.upload({
        fileName,
        fileType,
        body,
      });

      expect(result.url).toBe(`mocked-uuid-123-${fileName}`);
    });

    it("should handle different file types", async () => {
      const testCases = [
        { fileName: "document.pdf", fileType: "application/pdf" },
        { fileName: "image.png", fileType: "image/png" },
        { fileName: "video.mp4", fileType: "video/mp4" },
        { fileName: "text.txt", fileType: "text/plain" },
      ];

      for (const testCase of testCases) {
        mockClient.send.mockResolvedValue({});

        const body = Buffer.from("test-content");
        const result = await s3Uploader.upload({
          fileName: testCase.fileName,
          fileType: testCase.fileType,
          body,
        });

        expect(PutObjectCommand).toHaveBeenCalledWith({
          Bucket: "test-bucket",
          Key: `mocked-uuid-123-${testCase.fileName}`,
          ContentType: testCase.fileType,
          Body: body,
        });
        expect(result.url).toBe(`mocked-uuid-123-${testCase.fileName}`);
      }
    });

    it("should handle large file uploads", async () => {
      const fileName = "large-file.zip";
      const fileType = "application/zip";
      const body = Buffer.alloc(1024 * 1024, "a"); // 1MB buffer

      mockClient.send.mockResolvedValue({});

      const result = await s3Uploader.upload({
        fileName,
        fileType,
        body,
      });

      expect(mockClient.send).toHaveBeenCalledWith(
        expect.any(PutObjectCommand)
      );
      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: "test-bucket",
        Key: "mocked-uuid-123-large-file.zip",
        ContentType: "application/zip",
        Body: body,
      });
      expect(result).toEqual({
        url: "mocked-uuid-123-large-file.zip",
      });
    });

    it("should use configured bucket name", async () => {
      const fileName = "test.jpg";
      const fileType = "image/jpeg";
      const body = Buffer.from("content");

      mockClient.send.mockResolvedValue({});

      await s3Uploader.upload({
        fileName,
        fileType,
        body,
      });

      expect(PutObjectCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: config.storage.attachmentsBucketName,
        })
      );
    });
  });

  describe("error handling", () => {
    it("should propagate S3 upload errors", async () => {
      const error = new Error("S3 upload failed");
      mockClient.send.mockRejectedValue(error);

      const fileName = "test.jpg";
      const fileType = "image/jpeg";
      const body = Buffer.from("content");

      await expect(
        s3Uploader.upload({
          fileName,
          fileType,
          body,
        })
      ).rejects.toThrow("S3 upload failed");
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network timeout");
      mockClient.send.mockRejectedValue(networkError);

      const fileName = "network-test.pdf";
      const fileType = "application/pdf";
      const body = Buffer.from("test content");

      await expect(
        s3Uploader.upload({
          fileName,
          fileType,
          body,
        })
      ).rejects.toThrow("Network timeout");
    });
  });
});