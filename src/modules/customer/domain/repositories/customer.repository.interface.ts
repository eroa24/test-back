import { Customer } from "../entities/customer.entity";
import { CreateCustomerDto } from "../../presentation/dtos/create-customer.dto";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";

export interface ICustomerRepository {
  create(customerDto: CreateCustomerDto): Promise<Result<Customer>>;
  findAll(): Promise<Result<Customer[]>>;
}
