import { Product } from "../../../domain/entities/product.entity";

describe("Product Entity", () => {
  it("should create a product with default values", () => {
    const product = new Product();

    expect(product).toBeDefined();
    expect(product.id).toBeUndefined();
    expect(product.name).toBeUndefined();
    expect(product.description).toBeUndefined();
    expect(product.price).toBeUndefined();
    expect(product.stock).toBeUndefined();
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);
  });

  it("should create a product with provided values", () => {
    const productData = {
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 10,
    };

    const product = new Product(productData);

    expect(product.name).toBe(productData.name);
    expect(product.description).toBe(productData.description);
    expect(product.price).toBe(productData.price);
    expect(product.stock).toBe(productData.stock);
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);
  });
});
