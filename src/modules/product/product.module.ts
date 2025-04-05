import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./infrastructure/persistence/entities/product.entity";
import { ProductController } from "./presentation/controllers/product.controller";
import { CreateProductUseCase } from "./application/use-cases/create-product.use-case";
import { GetAllProductsUseCase } from "./application/use-cases/get-all-products.use-case";
import { ProductRepository } from "./infrastructure/persistence/product.repository";
import { CommonModule } from "@/common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), CommonModule],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    GetAllProductsUseCase,
    {
      provide: "IProductRepository",
      useClass: ProductRepository,
    },
  ],
})
export class ProductModule {}
