export interface PaginationParams<T> {
  data: T[];
  totalPages: number;
  totalSize: number;
  currentPage: number;
  pageSize: number;
}
