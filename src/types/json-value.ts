export type JsonValue =
  | { [key: string]: JsonValue }
  | JsonValue[]
  | boolean
  | string
  | number
  | null;
