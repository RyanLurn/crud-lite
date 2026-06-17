import type { AppError } from "@/types/app-error";

export type SuccessResult<TData> = {
  success: true;
  data: TData;
};

export type ErrorResult<TCode extends string> = {
  success: false;
  error: AppError<TCode>;
  context: {
    cause: unknown;
  };
};

export type Result<TData, TErrorCode extends string> =
  | ErrorResult<TErrorCode>
  | SuccessResult<TData>;
