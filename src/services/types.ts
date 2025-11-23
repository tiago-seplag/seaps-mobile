/**
 * Tipos compartilhados entre os serviços
 */

export interface PaginationParams {
  page?: number;
  per_page?: number;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
