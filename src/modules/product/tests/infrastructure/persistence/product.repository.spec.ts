import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductRepository } from "../../../infrastructure/persistence/product.repository";
import { ProductEntity } from "../../../infrastructure/persistence/entities/product.entity";
import { ErrorType } from "@/common/types";

describe("ProductRepository", () => {
  let repository: ProductRepository;
  let typeOrmRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
    typeOrmRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity)
    );
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("create", () => {
    const productDto = {
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 10,
    };

    it("should create a product successfully", async () => {
      const savedProduct = new ProductEntity();
      Object.assign(savedProduct, productDto);
      savedProduct.id = "123e4567-e89b-12d3-a456-426614174000";
      savedProduct.createdAt = new Date();
      savedProduct.updatedAt = new Date();

      jest.spyOn(typeOrmRepository, "save").mockResolvedValue(savedProduct);

      const result = await repository.create(productDto);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(expect.objectContaining(productDto));
      expect(typeOrmRepository.save).toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      jest
        .spyOn(typeOrmRepository, "save")
        .mockRejectedValue(new Error("Database error"));

      const result = await repository.create(productDto);

      expect(result.isFailure).toBe(true);
      expect(result.error?.message).toBe("Error al crear el producto");
      expect(result.error?.type).toBe(ErrorType.DATABASE);
    });
  });

  describe("findAll", () => {
    it("should return all products successfully", async () => {
      const products = [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "Product 1",
          description: "Description 1",
          price: 100,
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "123e4567-e89b-12d3-a456-426614174001",
          name: "Product 2",
          description: "Description 2",
          price: 200,
          stock: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(typeOrmRepository, "find")
        .mockResolvedValue(products as ProductEntity[]);

      const result = await repository.findAll();

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toHaveLength(2);
      expect(result.getValue()[0]).toEqual(
        expect.objectContaining(products[0])
      );
      expect(result.getValue()[1]).toEqual(
        expect.objectContaining(products[1])
      );
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      jest
        .spyOn(typeOrmRepository, "find")
        .mockRejectedValue(new Error("Database error"));

      const result = await repository.findAll();

      expect(result.isFailure).toBe(true);
      expect(result.error?.type).toBe(ErrorType.DATABASE);
      expect(result.error?.message).toBe("Database error");
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });
  });
});
