import { FindOptionsWhere, FindOptionsOrder } from "typeorm";

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder: "ASC" | "DESC";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function getPaginationOptions(query: any): PaginationOptions {
  return {
    page: parseInt(query.page as string) || 1,
    limit: parseInt(query.limit as string) || 10,
    sortBy: query.sortBy as string,
    sortOrder: (query.sortOrder as "ASC" | "DESC") || "DESC",
  };
}

export function getPaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
  };
}

export function createOrderByClause(
  sortBy?: string,
  sortOrder: "ASC" | "DESC" = "DESC"
): FindOptionsOrder<any> {
  if (!sortBy) {
    return { createdAt: sortOrder };
  }

  return { [sortBy]: sortOrder };
}

export function createWhereClause(
  filters: Record<string, any>
): FindOptionsWhere<any> {
  const where: FindOptionsWhere<any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      where[key] = value;
    }
  });

  return where;
}
