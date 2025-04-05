import { Product } from "../entities/product.entity";
import { CreateProductRequestDto } from "../../presentation/dtos/request/create-product.request.dto";
import { Result } from "@/common/types";

export interface IProductRepository {
  create(createProductDto: CreateProductRequestDto): Promise<Result<Product>>;
  findAll(): Promise<Result<Product[]>>;
}
