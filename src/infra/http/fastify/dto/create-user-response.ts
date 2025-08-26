export type CreateUserResponse =
  | {
      message: string;
    }
  | {
      user: {
        id: string;
        name: string;
        email: string;
        cpf: string;
      };
    };
