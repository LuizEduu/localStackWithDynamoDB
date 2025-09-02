import { Uploader } from "../../src/domain/application/storage/uploader";

export class UploaderStub implements Uploader {
  async upload({
    fileName,
    fileType,
    body,
  }: {
    fileName: string;
    fileType: string;
    body: Buffer;
  }): Promise<{ url: string }> {
    return {
      url: "https://mockedUrl",
    };
  }
}
