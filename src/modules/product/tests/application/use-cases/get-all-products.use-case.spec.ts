import { Test, TestingModule } from "@nestjs/testing";
import { GetAllProductsUseCase } from "../../../application/use-cases/get-all-products.use-case";
import { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { Product } from "../../../domain/entities/product.entity";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";

describe("GetAllProductsUseCase", () => {
  let useCase: GetAllProductsUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllProductsUseCase,
        {
          provide: "IProductRepository",
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllProductsUseCase>(GetAllProductsUseCase);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should return all products sucess", async () => {
    const products = [
      new Product({
        name: "Product 1",
        description: "Test product 1",
        price: 100,
        stock: 10,
      }),
      new Product({
        name: "Product 2",
        description: "Test product 2",
        price: 200,
        stock: 20,
      }),
    ];

    const successResult = Result.sucess<Product[]>(products);
    mockRepository.findAll.mockResolvedValue(successResult);

    const result = await useCase.execute();

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual(products);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it("should return error when repository fails", async () => {
    const errorResult = Result.fail<Product[]>(
      "Error al obtener los productos",
      ErrorType.DATABASE
    );
    mockRepository.findAll.mockResolvedValue(errorResult);

    const result = await useCase.execute();

    expect(result.isFailure).toBe(true);
    expect(result.error?.type).toBe(ErrorType.DATABASE);
    expect(result.error?.message).toBe("Error al obtener los productos");
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it("should return internal error when unexpected error", async () => {
    mockRepository.findAll.mockRejectedValue(new Error("Unexpected error"));

    const result = await useCase.execute();

    expect(result.isFailure).toBe(true);
    expect(result.error?.type).toBe(ErrorType.INTERNAL);
    expect(result.error?.message).toBe(
      "Error inesperado al obtener los productos"
    );
  });
});
