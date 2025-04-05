import { Test, TestingModule } from "@nestjs/testing";
import { CustomerController } from "../../../presentation/controllers/customer.controller";
import { CreateCustomerUseCase } from "../../../application/use-cases/create-customer.use-case";
import { CreateCustomerDto } from "../../../presentation/dtos/create-customer.dto";
import { Customer } from "../../../domain/entities/customer.entity";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";
import { ErrorHandlerService } from "@/common/services/error-handler.service";

describe("CustomerController", () => {
  let controller: CustomerController;
  let createCustomerUseCase: CreateCustomerUseCase;
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
    errorHandlerService = module.get<ErrorHandlerService>(ErrorHandlerService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createCustomer", () => {
    it("should create a customer successfully", async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: "Test Customer",
        email: "test@example.com",
        phone: "1234567890",
        address: "Test Address",
      };

      const customer = new Customer(createCustomerDto);
      customer.id = 1;
      const successResult = Result.sucess<Customer>(customer);
      jest
        .spyOn(createCustomerUseCase, "execute")
        .mockResolvedValue(successResult);
      jest.spyOn(errorHandlerService, "handleError").mockReturnValue(customer);

      const result = await controller.createCustomer(createCustomerDto);

      expect(result).toEqual(customer);
      expect(createCustomerUseCase.execute).toHaveBeenCalledWith(
        createCustomerDto
      );
    });

    it("should throw error when use case fails", async () => {
      const createCustomerDto: CreateCustomerDto = {
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
});
