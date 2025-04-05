import { Injectable, Inject } from "@nestjs/common";
import { IProductRepository } from "../../domain/repositories/product.repository.interface";
import { Product } from "../../domain/entities/product.entity";
import { Result, ErrorType } from "@/common/types";

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject("IProductRepository")
    private readonly productRepository: IProductRepository
  ) {}

  async execute(): Promise<Result<Product[]>> {
    try {
      const productsResult = await this.productRepository.findAll();

      if (productsResult.isFailure) {
        return Result.fail<Product[]>(
          productsResult.error?.message || "Error al obtener los productos",
          productsResult.error?.type
        );
      }

      return Result.sucess<Product[]>(productsResult.getValue());
    } catch (error) {
      return Result.fail<Product[]>(
        "Error inesperado al obtener los productos",
        ErrorType.INTERNAL
      );
    }
  }
}
