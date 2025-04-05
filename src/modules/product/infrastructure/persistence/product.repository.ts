import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "./entities/product.entity";
import { IProductRepository } from "../../domain/repositories/product.repository.interface";
import { Product } from "../../domain/entities/product.entity";
import { CreateProductRequestDto } from "../../presentation/dtos/request/create-product.request.dto";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async create(productDto: CreateProductRequestDto): Promise<Result<Product>> {
    try {
      const product = new Product(productDto);
      const productEntity = this.mapToEntity(product);
      const savedProduct = await this.productRepository.save(productEntity);
      return Result.sucess<Product>(this.mapToDomain(savedProduct));
    } catch (error) {
      return Result.fail<Product>(
        "Error al crear el producto",
        ErrorType.DATABASE
      );
    }
  }

  async findAll(): Promise<Result<Product[]>> {
    try {
      const products = await this.productRepository.find();
      return Result.sucess<Product[]>(
        products.map((product) => this.mapToDomain(product))
      );
    } catch (error) {
      return Result.fail<Product[]>(
        error.message || "Error al obtener los productos",
        ErrorType.DATABASE
      );
    }
  }

  private mapToEntity(product: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = product.id ?? uuidv4();
    entity.name = product.name;
    entity.description = product.description;
    entity.price = product.price;
    entity.stock = product.stock;
    entity.createdAt = product.createdAt ?? new Date();
    entity.updatedAt = product.updatedAt ?? new Date();
    return entity;
  }

  private mapToDomain(entity: ProductEntity): Product {
    const product = new Product({
      name: entity.name,
      description: entity.description,
      price: entity.price,
      stock: entity.stock,
    });
    product.id = entity.id;
    product.createdAt = entity.createdAt;
    product.updatedAt = entity.updatedAt;
    return product;
  }
}
