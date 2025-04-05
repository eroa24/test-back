import { Injectable, Inject } from "@nestjs/common";
import { ICustomerRepository } from "../../domain/repositories/customer.repository.interface";
import { CreateCustomerRequestDto } from "../../presentation/dtos/request/create-customer.request.dto";
import { Customer } from "../../domain/entities/customer.entity";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject("ICustomerRepository")
    private readonly customerRepository: ICustomerRepository
  ) {}

  async execute(
    customerDto: CreateCustomerRequestDto
  ): Promise<Result<Customer>> {
    try {
      const existingCustomers = await this.customerRepository.findAll();
      if (existingCustomers.isSuccess) {
        const emailExists = existingCustomers
          .getValue()
          .some((customer) => customer.email === customerDto.email);
        if (emailExists) {
          return Result.fail<Customer>(
            "El email ya está registrado",
            ErrorType.VALIDATION
          );
        }
      }

      const result = await this.customerRepository.create(customerDto);
      if (result.isFailure) {
        return Result.fail<Customer>(
          result.error?.message || "Error al crear el cliente",
          result.error?.type || ErrorType.INTERNAL
        );
      }

      return Result.sucess<Customer>(result.getValue());
    } catch (error) {
      return Result.fail<Customer>(
        "Error inesperado al crear el cliente",
        ErrorType.INTERNAL
      );
    }
  }
}
