export interface ApiResponse<T> {
  response: T | null;
  error: string | null;
}
