import { Injectable, Inject } from "@nestjs/common";
import { ICustomerRepository } from "../../domain/repositories/customer.repository.interface";
import { Customer } from "../../domain/entities/customer.entity";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";

@Injectable()
export class GetAllCustomersUseCase {
  constructor(
    @Inject("ICustomerRepository")
    private readonly customerRepository: ICustomerRepository
  ) {}

  async execute(): Promise<Result<Customer[]>> {
    try {
      const result = await this.customerRepository.findAll();
      if (result.isFailure) {
        return Result.fail<Customer[]>(
          result.error?.message || "Error al obtener los clientes",
          result.error?.type || ErrorType.INTERNAL
        );
      }

      return Result.sucess<Customer[]>(result.getValue());
    } catch (error) {
      return Result.fail<Customer[]>(
        "Error inesperado al obtener los clientes",
        ErrorType.INTERNAL
      );
    }
  }
}
