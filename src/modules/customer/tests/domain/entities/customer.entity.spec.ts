import { Customer } from "../../../domain/entities/customer.entity";

describe("Customer Entity", () => {
  it("should create a customer with default values", () => {
    const customer = new Customer({
      name: "Test Customer",
      email: "test@example.com",
      phone: "1234567890",
      address: "Test Address",
    });

    expect(customer.name).toBe("Test Customer");
    expect(customer.email).toBe("test@example.com");
    expect(customer.phone).toBe("1234567890");
    expect(customer.address).toBe("Test Address");
    expect(customer.createdAt).toBeInstanceOf(Date);
    expect(customer.updatedAt).toBeInstanceOf(Date);
  });
});
