export type UnexpectedErrorCode = "UNEXPECTED_ERROR";
export type SQLiteErrorCode = "SQLITE_ERROR";

export type AppError<TCode extends string> = {
  code: TCode;
  message: string;
  retryable: boolean;
};
