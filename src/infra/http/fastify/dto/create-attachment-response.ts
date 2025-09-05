export type CreateAttachmentResponse =
  | {
      message: string;
    }
  | {
      attachment: {
        id: string;
        url: string;
      };
    };
