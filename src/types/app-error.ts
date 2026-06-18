export type UnexpectedErrorCode = "UNEXPECTED_ERROR";
export type InternalServerErrorCode = "INTERNAL_SERVER_ERROR";

export type AppError<TCode extends string> = {
  code: TCode;
  message: string;
  retryable: boolean;
};
