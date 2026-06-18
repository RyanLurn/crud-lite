import type { JsonValue } from "@/types/json-value";
import type { AppError } from "@/types/app-error";

// These are the data types that TanStack Router can serialize
export type SerializableData =
  | { [key: string]: SerializableData }
  | SerializableData[]
  | JsonValue
  | undefined
  | FormData
  | Error
  | Date;

export type SerializableSuccessResult<TData extends SerializableData> = {
  success: true;
  data: TData;
};

export type SerializableErrorResult<TCode extends string> = {
  success: false;
  error: AppError<TCode>;
};

export type SerializableResult<
  TData extends SerializableData,
  TErrorCode extends string,
> = SerializableErrorResult<TErrorCode> | SerializableSuccessResult<TData>;
