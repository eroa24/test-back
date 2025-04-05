import { DomainError, ErrorType } from "../types/error-types";

export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  public readonly error: DomainError | null;
  private readonly _value: T;

  private constructor(
    isSuccess: boolean,
    error: DomainError | null = null,
    value?: T
  ) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value as T;
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error("No se puede obtener el valor de un resultado fallido");
    }
    return this._value;
  }

  public static sucess<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(
    message: string,
    type: ErrorType = ErrorType.INTERNAL
  ): Result<U> {
    return new Result<U>(false, new DomainError(message, type));
  }
}
