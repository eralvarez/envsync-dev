interface PromiseResponse<DataType = any, ErrorType = any> {
  data: DataType;
  error: ErrorType;
}

export type { PromiseResponse };
