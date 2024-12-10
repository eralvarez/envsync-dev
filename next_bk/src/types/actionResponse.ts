interface ActionResponse<DataType = any, ErrorType = any> {
  data: DataType;
  error: ErrorType;
}

export type { ActionResponse };