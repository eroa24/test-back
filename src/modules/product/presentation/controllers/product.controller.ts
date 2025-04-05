import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateProductDto } from "../dtos/create-product.dto";
import { Product } from "../../domain/entities/product.entity";
import { ErrorHandlerService } from "@/common/services/error-handler.service";
import { CreateProductUseCase } from "../../application/use-cases/create-product.use-case";

@ApiTags("products")
@Controller("products")
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  @Post()
  @ApiOperation({ summary: "Crear un nuevo producto" })
  @ApiResponse({ status: 201, description: "Producto creado exitosamente" })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  async createProduct(
    @Body() createProductDto: CreateProductDto
  ): Promise<Product> {
    const result = await this.createProductUseCase.execute(createProductDto);
    return this.errorHandler.handleError(result);
  }
}
