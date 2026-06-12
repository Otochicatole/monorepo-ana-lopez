export interface PaginationInput {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export function createPaginationMeta(
  input: PaginationInput,
  total: number
): PaginationMeta {
  return {
    page: input.page,
    pageSize: input.pageSize,
    pageCount: Math.ceil(total / input.pageSize),
    total,
  };
}

