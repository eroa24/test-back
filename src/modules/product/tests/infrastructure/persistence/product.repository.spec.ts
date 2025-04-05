import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductRepository } from "../../../infrastructure/persistence/product.repository";
import { Product } from "../../../domain/entities/product.entity";
import { ErrorType } from "@/common/types";

describe("ProductRepository", () => {
  let repository: ProductRepository;
  let typeOrmRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
    typeOrmRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("create", () => {
    it("should create a product successfully", async () => {
      const createProductDto = {
        name: " Product name",
        description: " Description product",
        price: 100,
        stock: 10,
      };

      const savedProduct = new Product(createProductDto);
      savedProduct.id = 1;
      jest.spyOn(typeOrmRepository, "save").mockResolvedValue(savedProduct);

      const result = await repository.create(createProductDto);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(savedProduct);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(createProductDto)
      );
    });

    it("should return database error when save fails", async () => {
      const createProductDto = {
        name: " Product",
        description: " Description",
        price: 100,
        stock: 10,
      };

      const error = new Error("Database error");
      jest.spyOn(typeOrmRepository, "save").mockRejectedValue(error);

      const result = await repository.create(createProductDto);

      expect(result.isFailure).toBe(true);
      expect(result.error?.type).toBe(ErrorType.DATABASE);
      expect(result.error?.message).toBe("Database error");
      expect(typeOrmRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(createProductDto)
      );
    });
  });
});
