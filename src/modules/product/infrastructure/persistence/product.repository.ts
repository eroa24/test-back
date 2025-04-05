import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../../domain/entities/product.entity";
import { CreateProductDto } from "../../presentation/dtos/create-product.dto";
import { IProductRepository } from "../../domain/repositories/product.repository.interface";
import { Result, ErrorType } from "@/common/types";

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Result<Product>> {
    try {
      const product = this.productRepository.create(createProductDto);
      const savedProduct = await this.productRepository.save(product);
      return Result.ok<Product>(savedProduct);
    } catch (error) {
      return Result.fail<Product>(
        `Error al crear el producto: ${error.message}`,
        ErrorType.DATABASE
      );
    }
  }
}
