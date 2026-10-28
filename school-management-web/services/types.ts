export interface CurrentUser {
  id: string;
  name: string;
  username: string;
  roles: string[];
}

export interface ApiPaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
}

export interface ServiceError {
  message: string;
  statusCode?: number;
  code?: string;
}
