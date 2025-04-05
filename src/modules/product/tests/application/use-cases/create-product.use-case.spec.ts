import { Test, TestingModule } from "@nestjs/testing";
import { CreateProductUseCase } from "../../../application/use-cases/create-product.use-case";
import { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { Product } from "../../../domain/entities/product.entity";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";

describe("CreateProductUseCase", () => {
  let useCase: CreateProductUseCase;
  let productRepository: IProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: "IProductRepository",
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
    productRepository = module.get<IProductRepository>("IProductRepository");
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const createProductDto = {
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 10,
    };

    it("should create a product successfully", async () => {
      const product = new Product(createProductDto);
      jest
        .spyOn(productRepository, "create")
        .mockResolvedValue(Result.sucess(product));

      const result = await useCase.execute(createProductDto);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(
        expect.objectContaining(createProductDto)
      );
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
    });

    it("should handle repository errors", async () => {
      jest
        .spyOn(productRepository, "create")
        .mockResolvedValue(
          Result.fail("Error al crear el producto", ErrorType.DATABASE)
        );

      const result = await useCase.execute(createProductDto);

      expect(result.isFailure).toBe(true);
      expect(result.error?.message).toBe("Error al crear el producto");
      expect(result.error?.type).toBe(ErrorType.DATABASE);
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
    });

    it("should handle unexpected errors", async () => {
      jest
        .spyOn(productRepository, "create")
        .mockRejectedValue(new Error("Unexpected error"));

      const result = await useCase.execute(createProductDto);

      expect(result.isFailure).toBe(true);
      expect(result.error?.message).toBe(
        "Error inesperado al crear el producto"
      );
      expect(result.error?.type).toBe(ErrorType.INTERNAL);
    });
  });
});
