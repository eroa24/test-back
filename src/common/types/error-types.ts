export enum ErrorType {
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  DATABASE = "DATABASE",
  INTERNAL = "INTERNAL",
}

export class DomainError extends Error {
  constructor(
    public readonly message: string,
    public readonly type: ErrorType
  ) {
    super(message);
  }
}
