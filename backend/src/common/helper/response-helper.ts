export interface ServiceResponse<T> {
  data: T | null;
  length: number;
  error: unknown;
  statusCode: number;
  metadata?: Record<string, unknown>;
}

export function ResponseHelper<T>(
  data: T | null,
  statusCode = 200,
  error: unknown = null,
  metadata?: Record<string, unknown>
): ServiceResponse<T> {
  const length = Array.isArray(data) ? data.length : data ? 1 : 0;

  return {
    data,
    length,
    error,
    statusCode,
    ...(metadata && { metadata })
  };
}
