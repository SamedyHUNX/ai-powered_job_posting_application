interface ApiErrorShape {
  status: string;
  code: number;
  message: string;
}

export class ApiError extends Error implements ApiErrorShape {
  constructor(public status: string, public code: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}
