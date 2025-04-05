import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from "./modules/product/product.module";
import { CustomerModule } from "./modules/customer/customer.module";
import { CommonModule } from "./common/common.module";
import { ProductEntity } from "./modules/product/infrastructure/persistence/entities/product.entity";
import { CustomerEntity } from "./modules/customer/infrastructure/persistence/entities/customer.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 5432),
        username: configService.get("DB_USERNAME", "postgres"),
        password: configService.get("DB_PASSWORD", "postgres"),
        database: configService.get("DB_DATABASE", "test/back"),
        entities: [ProductEntity, CustomerEntity],
        synchronize:
          configService.get("NODE_ENV", "development") === "development",
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    ProductModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
