import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "../../../presentation/controllers/product.controller";
import { CreateProductUseCase } from "../../../application/use-cases/create-product.use-case";
import { CreateProductDto } from "../../../presentation/dtos/create-product.dto";
import { Product } from "../../../domain/entities/product.entity";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";
import { ErrorHandlerService } from "@/common/services/error-handler.service";

describe("ProductController", () => {
  let controller: ProductController;
  let createProductUseCase: CreateProductUseCase;
  let errorHandlerService: ErrorHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: CreateProductUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ErrorHandlerService,
          useValue: {
            handleError: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    createProductUseCase =
      module.get<CreateProductUseCase>(CreateProductUseCase);
    errorHandlerService = module.get<ErrorHandlerService>(ErrorHandlerService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createProduct", () => {
    it("should create a product sucess", async () => {
      const createProductDto: CreateProductDto = {
        name: " Product",
        description: " Description",
        price: 100,
        stock: 10,
      };

      const product = new Product(createProductDto);
      product.id = 1;
      const successResult = Result.ok<Product>(product);
      jest
        .spyOn(createProductUseCase, "execute")
        .mockResolvedValue(successResult);

      const result = await controller.createProduct(createProductDto);

      expect(result).toEqual(product);
      expect(createProductUseCase.execute).toHaveBeenCalledWith(
        createProductDto
      );
    });

    it("should throw error when use case fails", async () => {
      const createProductDto: CreateProductDto = {
        name: " Product",
        description: " Description",
        price: -100,
        stock: 10,
      };

      const errorResult = Result.fail<Product>(
        "El precio no puede ser negativo",
        ErrorType.VALIDATION
      );
      jest
        .spyOn(createProductUseCase, "execute")
        .mockResolvedValue(errorResult);
      jest.spyOn(errorHandlerService, "handleError").mockImplementation(() => {
        throw new Error("El precio no puede ser negativo");
      });

      await expect(controller.createProduct(createProductDto)).rejects.toThrow(
        "El precio no puede ser negativo"
      );
      expect(createProductUseCase.execute).toHaveBeenCalledWith(
        createProductDto
      );
    });
  });
});
