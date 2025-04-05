import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateCustomerRequestDto } from "../dtos/request/create-customer.request.dto";
import { CustomerResponseDto } from "../dtos/response/customer.response.dto";
import { CreateCustomerUseCase } from "../../application/use-cases/create-customer.use-case";
import { GetAllCustomersUseCase } from "../../application/use-cases/get-all-customers.use-case";
import { ErrorHandlerService } from "@/common/services/error-handler.service";

@Controller("customers")
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Crear un nuevo cliente" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Cliente creado exitosamente",
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Datos de cliente inválidos",
  })
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerRequestDto
  ): Promise<CustomerResponseDto> {
    const result = await this.createCustomerUseCase.execute(createCustomerDto);
    if (result.isFailure) {
      this.errorHandler.handleError(result);
    }
    const customer = result.getValue();
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  @Get()
  @ApiOperation({ summary: "Obtener todos los clientes" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Lista de clientes obtenida exitosamente",
    type: [CustomerResponseDto],
  })
  async getAllCustomers(): Promise<CustomerResponseDto[]> {
    const result = await this.getAllCustomersUseCase.execute();
    if (result.isFailure) {
      this.errorHandler.handleError(result);
    }
    return result.getValue().map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    }));
  }
}
