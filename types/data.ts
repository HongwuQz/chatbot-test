export interface KeyValuePair {
  key: string;
  value: any;
}

export interface ApiResult<T> {
  Code: number
  Data: T
  Msg: string
}