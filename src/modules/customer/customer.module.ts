import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerEntity } from "./infrastructure/persistence/entities/customer.entity";
import { CustomerController } from "./presentation/controllers/customer.controller";
import { CreateCustomerUseCase } from "./application/use-cases/create-customer.use-case";
import { GetAllCustomersUseCase } from "./application/use-cases/get-all-customers.use-case";
import { CustomerRepository } from "./infrastructure/persistence/customer.repository";
import { CommonModule } from "@/common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]), CommonModule],
  controllers: [CustomerController],
  providers: [
    CreateCustomerUseCase,
    GetAllCustomersUseCase,
    {
      provide: "ICustomerRepository",
      useClass: CustomerRepository,
    },
  ],
})
export class CustomerModule {}
