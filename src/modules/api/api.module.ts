export enum ApiStatus {
  SUCCESS = 200,
  ERROR,
}

export interface ApiResponse<T = any> {
  statusCode: ApiStatus;
  message: string;
  data?: T;
}

export class ApiErrorResponse extends Error {
  status: ApiStatus;
  code: number;
  message: string;

  constructor(code?: number, message?: string, error?: any) {
    if (error) {
      super(error.response?.data?.message || error.message);
      this.status = ApiStatus.ERROR;
      this.message = error.response?.data?.message || error.message;
      this.code = 500;
    } else if (error instanceof Error) {
      super(error.message);
      this.status = ApiStatus.ERROR;
      this.message = error.message;
      this.code = 500;
    } else {
      super(message);
      this.status = ApiStatus.ERROR;
      this.message = message || 'An error occurred';
      this.code = code || 500;
    }
  }
}