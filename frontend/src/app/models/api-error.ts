export interface ApiError {
  headers: Record<string, unknown>;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  error: {
    message: string;
  };
}
