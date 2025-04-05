import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CustomerEntity } from "./entities/customer.entity";
import { ICustomerRepository } from "../../domain/repositories/customer.repository.interface";
import { Customer } from "../../domain/entities/customer.entity";
import { CreateCustomerRequestDto } from "../../presentation/dtos/request/create-customer.request.dto";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>
  ) {}

  async create(
    customerDto: CreateCustomerRequestDto
  ): Promise<Result<Customer>> {
    try {
      const customer = new Customer(customerDto);
      const savedCustomer = await this.customerRepository.save(customer);
      return Result.sucess<Customer>(savedCustomer);
    } catch (error) {
      return Result.fail<Customer>(
        "Error al crear el cliente",
        ErrorType.DATABASE
      );
    }
  }

  async findAll(): Promise<Result<Customer[]>> {
    try {
      const customers = await this.customerRepository.find();
      return Result.sucess<Customer[]>(customers);
    } catch (error) {
      return Result.fail<Customer[]>(
        "Error al obtener los clientes",
        ErrorType.DATABASE
      );
    }
  }
}
