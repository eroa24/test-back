import { Injectable, Inject } from "@nestjs/common";
import { CreateProductDto } from "../../presentation/dtos/create-product.dto";
import { Product } from "../../domain/entities/product.entity";
import { IProductRepository } from "../../domain/repositories/product.repository.interface";
import { Result, ErrorType } from "@/common/types";

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject("IProductRepository")
    private readonly productRepository: IProductRepository
  ) {}

  async execute(createProductDto: CreateProductDto): Promise<Result<Product>> {
    if (createProductDto.price < 0) {
      return Result.fail<Product>(
        "El precio no puede ser negativo",
        ErrorType.VALIDATION
      );
    }

    if (createProductDto.stock < 0) {
      return Result.fail<Product>(
        "El stock no puede ser negativo",
        ErrorType.VALIDATION
      );
    }

    const result = await this.productRepository.create(createProductDto);

    if (result.isFailure) {
      return Result.fail<Product>(
        result.error?.message || "Error desconocido",
        ErrorType.DATABASE
      );
    }

    return Result.ok<Product>(result.getValue());
  }
}
