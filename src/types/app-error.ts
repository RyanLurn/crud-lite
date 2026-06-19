export type FallbackErrorCode = "FALLBACK_ERROR";
export type NotFoundErrorCode = "NOT_FOUND_ERROR";

export type AppError<TCode extends string> = {
  code: TCode;
  message: string;
  retryable: boolean;
};
