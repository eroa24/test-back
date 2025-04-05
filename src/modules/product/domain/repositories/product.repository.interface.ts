import { Product } from "../entities/product.entity";
import { CreateProductDto } from "../../presentation/dtos/create-product.dto";
import { Result } from "@/common/types";

export interface IProductRepository {
  create(createProductDto: CreateProductDto): Promise<Result<Product>>;
  findAll(): Promise<Result<Product[]>>;
}
