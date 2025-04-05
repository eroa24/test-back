import { Product } from "../../../domain/entities/product.entity";

describe("Product Entity", () => {
  it("should create a product with default values", () => {
    const product = new Product({
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 10,
    });

    expect(product.id).toBeUndefined();
    expect(product.name).toBe("Test Product");
    expect(product.description).toBe("Test Description");
    expect(product.price).toBe(100);
    expect(product.stock).toBe(10);
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);
  });
});
