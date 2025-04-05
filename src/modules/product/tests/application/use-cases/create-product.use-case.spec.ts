import { Test, TestingModule } from "@nestjs/testing";
import { CreateProductUseCase } from "../../../application/use-cases/create-product.use-case";
import { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { Product } from "../../../domain/entities/product.entity";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";

describe("CreateProductUseCase", () => {
  let useCase: CreateProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: "IProductRepository",
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should return validation error when price is negative", async () => {
    const createProductDto = {
      name: "Name Product",
      description: "Product Description",
      price: -10,
      stock: 10,
    };

    const result = await useCase.execute(createProductDto);

    expect(result.isFailure).toBe(true);
    expect(result.error?.type).toBe(ErrorType.VALIDATION);
    expect(result.error?.message).toBe("El precio no puede ser negativo");
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it("should return validation error when stock is negative", async () => {
    const createProductDto = {
      name: "Name Product",
      description: "Product Description",
      price: 100,
      stock: -5,
    };

    const result = await useCase.execute(createProductDto);

    expect(result.isFailure).toBe(true);
    expect(result.error?.type).toBe(ErrorType.VALIDATION);
    expect(result.error?.message).toBe("El stock no puede ser negativo");
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it("should return database error when repository fails", async () => {
    const createProductDto = {
      name: "Name Product",
      description: "Product Description",
      price: 100,
      stock: 10,
    };

    const dbError = Result.fail<Product>("Database error", ErrorType.DATABASE);
    mockRepository.create.mockResolvedValue(dbError);

    const result = await useCase.execute(createProductDto);

    expect(result.isFailure).toBe(true);
    expect(result.error?.type).toBe(ErrorType.DATABASE);
    expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
  });

  it("should return success when product is created", async () => {
    const createProductDto = {
      name: "Product Name",
      description: " Description",
      price: 100,
      stock: 10,
    };

    const product = new Product(createProductDto);
    product.id = 1;
    const successResult = Result.ok<Product>(product);
    mockRepository.create.mockResolvedValue(successResult);

    const result = await useCase.execute(createProductDto);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual(product);
    expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
  });
});
