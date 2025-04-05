import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "../../../presentation/controllers/product.controller";
import { CreateProductUseCase } from "../../../application/use-cases/create-product.use-case";
import { GetAllProductsUseCase } from "../../../application/use-cases/get-all-products.use-case";
import { CreateProductRequestDto } from "../../../presentation/dtos/request/create-product.request.dto";
import { Product } from "../../../domain/entities/product.entity";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";
import { ErrorHandlerService } from "@/common/services/error-handler.service";

describe("ProductController", () => {
  let controller: ProductController;
  let createProductUseCase: CreateProductUseCase;
  let getAllProductsUseCase: GetAllProductsUseCase;
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
          provide: GetAllProductsUseCase,
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
    getAllProductsUseCase = module.get<GetAllProductsUseCase>(
      GetAllProductsUseCase
    );
    errorHandlerService = module.get<ErrorHandlerService>(ErrorHandlerService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createProduct", () => {
    it("should create a product sucess", async () => {
      const createProductDto: CreateProductRequestDto = {
        name: "Product",
        description: "Description",
        price: 100,
        stock: 10,
      };

      const product = new Product(createProductDto);
      product.id = "123e4567-e89b-12d3-a456-426614174000";
      const successResult = Result.sucess<Product>(product);
      jest
        .spyOn(createProductUseCase, "execute")
        .mockResolvedValue(successResult);

      const result = await controller.createProduct(createProductDto);

      expect(result).toEqual({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
      expect(createProductUseCase.execute).toHaveBeenCalledWith(
        createProductDto
      );
    });

    it("should throw error when use case fails", async () => {
      const createProductDto: CreateProductRequestDto = {
        name: "Product",
        description: "Description",
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

  describe("getAllProducts", () => {
    it("should return all products successfully", async () => {
      const products = [
        new Product({
          name: "Product 1",
          description: "Description 1",
          price: 100,
          stock: 10,
        }),
        new Product({
          name: "Product 2",
          description: "Description 2",
          price: 200,
          stock: 20,
        }),
      ];

      products[0].id = "123e4567-e89b-12d3-a456-426614174000";
      products[1].id = "987fcdeb-a89b-12d3-a456-426614174000";

      const successResult = Result.sucess<Product[]>(products);
      jest
        .spyOn(getAllProductsUseCase, "execute")
        .mockResolvedValue(successResult);

      const result = await controller.getAllProducts();

      expect(result).toEqual([
        {
          id: products[0].id,
          name: products[0].name,
          description: products[0].description,
          price: products[0].price,
          stock: products[0].stock,
          createdAt: products[0].createdAt,
          updatedAt: products[0].updatedAt,
        },
        {
          id: products[1].id,
          name: products[1].name,
          description: products[1].description,
          price: products[1].price,
          stock: products[1].stock,
          createdAt: products[1].createdAt,
          updatedAt: products[1].updatedAt,
        },
      ]);
      expect(getAllProductsUseCase.execute).toHaveBeenCalled();
    });

    it("should throw error when use case fails", async () => {
      const errorResult = Result.fail<Product[]>(
        "Error al obtener los productos",
        ErrorType.DATABASE
      );
      jest
        .spyOn(getAllProductsUseCase, "execute")
        .mockResolvedValue(errorResult);
      jest.spyOn(errorHandlerService, "handleError").mockImplementation(() => {
        throw new Error("Error al obtener los productos");
      });

      await expect(controller.getAllProducts()).rejects.toThrow(
        "Error al obtener los productos"
      );
      expect(getAllProductsUseCase.execute).toHaveBeenCalled();
    });
  });
});
