export type RequestData<D, E = unknown> = [true, E] | [false, D];

export type PromiseRequestData<T, E = unknown> = Promise<RequestData<T, E>>;

export type PaginatedResponse<T> = {
  count: number;
  next: string;
  previous: string;
  results: T;
};

export type PaginatedRequest = {
  limit?: number;
  offset?: number;
};
