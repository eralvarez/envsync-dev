interface PromiseResponse<DataType = any, ErrorType = any> {
  data: DataType | null;
  error: ErrorType;
}

export type { PromiseResponse };
