import { Result } from "../result";
import { ErrorType } from "../error-types";

describe("Result", () => {
  it("should create a successful result", () => {
    const value = { id: 1, name: "Test" };
    const result = Result.ok(value);

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.error).toBeNull();
    expect(result.getValue()).toEqual(value);
  });

  it("should create a failed result", () => {
    const errorMessage = "Test error";
    const errorType = ErrorType.VALIDATION;
    const result = Result.fail(errorMessage, errorType);

    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe(errorMessage);
    expect(result.error?.type).toBe(errorType);
  });

  it("should throw when getting value from failed result", () => {
    const result = Result.fail("Error");

    expect(() => result.getValue()).toThrow();
  });

  it("should use INTERNAL as default error type", () => {
    const result = Result.fail("Error");

    expect(result.error?.type).toBe(ErrorType.INTERNAL);
  });
});
