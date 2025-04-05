import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateProductRequestDto } from "../dtos/request/create-product.request.dto";
import { ProductResponseDto } from "../dtos/response/product.response.dto";
import { ErrorHandlerService } from "@/common/services/error-handler.service";
import { CreateProductUseCase } from "../../application/use-cases/create-product.use-case";
import { GetAllProductsUseCase } from "../../application/use-cases/get-all-products.use-case";

@ApiTags("products")
@Controller("products")
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  @Post()
  @ApiOperation({ summary: "Crear un nuevo producto" })
  @ApiResponse({
    status: 201,
    description: "Producto creado exitosamente",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  async createProduct(
    @Body() createProductDto: CreateProductRequestDto
  ): Promise<ProductResponseDto> {
    const result = await this.createProductUseCase.execute(createProductDto);
    if (result.isFailure) {
      this.errorHandler.handleError(result);
    }
    const product = result.getValue();
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  @Get()
  @ApiOperation({ summary: "Obtener todos los productos" })
  @ApiResponse({
    status: 200,
    description: "Lista de productos obtenida exitosamente",
    type: [ProductResponseDto],
  })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  async getAllProducts(): Promise<ProductResponseDto[]> {
    const result = await this.getAllProductsUseCase.execute();
    if (result.isFailure) {
      this.errorHandler.handleError(result);
    }
    return result.getValue().map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }
}
