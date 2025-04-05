import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateCustomerDto } from "../dtos/create-customer.dto";
import { CreateCustomerUseCase } from "../../application/use-cases/create-customer.use-case";
import { Customer } from "../../domain/entities/customer.entity";
import { ErrorHandlerService } from "@/common/services/error-handler.service";

@ApiTags("Customers")
@Controller("customers")
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Crear un nuevo cliente" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Cliente creado exitosamente",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Datos de cliente inválidos",
  })
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto
  ): Promise<Customer> {
    const result = await this.createCustomerUseCase.execute(createCustomerDto);
    return this.errorHandler.handleError(result);
  }
}
