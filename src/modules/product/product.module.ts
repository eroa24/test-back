import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./domain/entities/product.entity";
import { ProductController } from "./presentation/controllers/product.controller";
import { ProductRepository } from "./infrastructure/persistence/product.repository";
import { CreateProductUseCase } from "./application/use-cases/create-product.use-case";
import { CommonModule } from "../../common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CommonModule],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    {
      provide: "IProductRepository",
      useClass: ProductRepository,
    },
  ],
})
export class ProductModule {}
