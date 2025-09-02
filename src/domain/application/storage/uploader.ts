type Upload = {
  fileName: string;
  fileType: string;
  body: Buffer;
};

export interface Uploader {
  upload({ fileName, fileType, body }: Upload): Promise<{ url: string }>;
}
