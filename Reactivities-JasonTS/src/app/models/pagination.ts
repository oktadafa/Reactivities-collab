import { Activity } from "./activity";

export interface Pagination {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: Activity[];
}

export interface PageNumber {
  pageNumber: number;
}
