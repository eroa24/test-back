import { Test, TestingModule } from "@nestjs/testing";
import { CustomerController } from "../../../presentation/controllers/customer.controller";
import { CreateCustomerUseCase } from "../../../application/use-cases/create-customer.use-case";
import { GetAllCustomersUseCase } from "../../../application/use-cases/get-all-customers.use-case";
import { CreateCustomerRequestDto } from "../../../presentation/dtos/request/create-customer.request.dto";
import { Customer } from "../../../domain/entities/customer.entity";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";
import { ErrorHandlerService } from "@/common/services/error-handler.service";

describe("CustomerController", () => {
  let controller: CustomerController;
  let createCustomerUseCase: CreateCustomerUseCase;
  let getAllCustomersUseCase: GetAllCustomersUseCase;
  let errorHandlerService: ErrorHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CreateCustomerUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetAllCustomersUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ErrorHandlerService,
          useValue: {
            handleError: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    createCustomerUseCase = module.get<CreateCustomerUseCase>(
      CreateCustomerUseCase
    );
    getAllCustomersUseCase = module.get<GetAllCustomersUseCase>(
      GetAllCustomersUseCase
    );
    errorHandlerService = module.get<ErrorHandlerService>(ErrorHandlerService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createCustomer", () => {
    it("should create a customer successfully", async () => {
      const createCustomerDto: CreateCustomerRequestDto = {
        name: "Test Customer",
        email: "test@example.com",
        phone: "1234567890",
        address: "Test Address",
      };

      const customer = new Customer(createCustomerDto);
      customer.id = "123e4567-e89b-12d3-a456-426614174000";
      const successResult = Result.sucess<Customer>(customer);
      jest
        .spyOn(createCustomerUseCase, "execute")
        .mockResolvedValue(successResult);

      const result = await controller.createCustomer(createCustomerDto);

      expect(result).toEqual({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      });
      expect(createCustomerUseCase.execute).toHaveBeenCalledWith(
        createCustomerDto
      );
    });

    it("should throw error when use case fails", async () => {
      const createCustomerDto: CreateCustomerRequestDto = {
        name: "Test Customer",
        email: "test@example.com",
        phone: "1234567890",
        address: "Test Address",
      };

      const errorResult = Result.fail<Customer>(
        "El email ya está registrado",
        ErrorType.VALIDATION
      );
      jest
        .spyOn(createCustomerUseCase, "execute")
        .mockResolvedValue(errorResult);
      jest.spyOn(errorHandlerService, "handleError").mockImplementation(() => {
        throw new Error("El email ya está registrado");
      });

      await expect(
        controller.createCustomer(createCustomerDto)
      ).rejects.toThrow("El email ya está registrado");
      expect(createCustomerUseCase.execute).toHaveBeenCalledWith(
        createCustomerDto
      );
    });
  });

  describe("getAllCustomers", () => {
    it("should return all customers successfully", async () => {
      const customers = [
        new Customer({
          name: "Customer 1",
          email: "customer1@example.com",
          phone: "1234567890",
          address: "Address 1",
        }),
        new Customer({
          name: "Customer 2",
          email: "customer2@example.com",
          phone: "0987654321",
          address: "Address 2",
        }),
      ];

      customers[0].id = "123e4567-e89b-12d3-a456-426614174000";
      customers[1].id = "987fcdeb-a89b-12d3-a456-426614174000";

      const successResult = Result.sucess<Customer[]>(customers);
      jest
        .spyOn(getAllCustomersUseCase, "execute")
        .mockResolvedValue(successResult);

      const result = await controller.getAllCustomers();

      expect(result).toEqual([
        {
          id: customers[0].id,
          name: customers[0].name,
          email: customers[0].email,
          phone: customers[0].phone,
          address: customers[0].address,
          createdAt: customers[0].createdAt,
          updatedAt: customers[0].updatedAt,
        },
        {
          id: customers[1].id,
          name: customers[1].name,
          email: customers[1].email,
          phone: customers[1].phone,
          address: customers[1].address,
          createdAt: customers[1].createdAt,
          updatedAt: customers[1].updatedAt,
        },
      ]);
      expect(getAllCustomersUseCase.execute).toHaveBeenCalled();
    });

    it("should throw error when use case fails", async () => {
      const errorResult = Result.fail<Customer[]>(
        "Error al obtener los clientes",
        ErrorType.DATABASE
      );
      jest
        .spyOn(getAllCustomersUseCase, "execute")
        .mockResolvedValue(errorResult);
      jest.spyOn(errorHandlerService, "handleError").mockImplementation(() => {
        throw new Error("Error al obtener los clientes");
      });

      await expect(controller.getAllCustomers()).rejects.toThrow(
        "Error al obtener los clientes"
      );
      expect(getAllCustomersUseCase.execute).toHaveBeenCalled();
    });
  });
});
