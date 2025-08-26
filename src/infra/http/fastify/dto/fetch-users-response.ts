type User = {
  id: string;
  name: string;
  email: string;
  cpf: string;
};

export type FetchUsersResponse =
  | {
      message: string;
    }
  | {
      data: User[];
      totalPages: number;
      totalSize: number;
      currentPage: number;
      pageSize: number;
    };
