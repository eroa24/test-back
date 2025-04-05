import { Test, TestingModule } from "@nestjs/testing";
import { CreateCustomerUseCase } from "../../../application/use-cases/create-customer.use-case";
import { ICustomerRepository } from "../../../domain/repositories/customer.repository.interface";
import { Customer } from "../../../domain/entities/customer.entity";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";

describe("CreateCustomerUseCase", () => {
  let useCase: CreateCustomerUseCase;
  let mockRepository: jest.Mocked<ICustomerRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCustomerUseCase,
        {
          provide: "ICustomerRepository",
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateCustomerUseCase>(CreateCustomerUseCase);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const customerDto = {
      name: "Customer",
      email: "test@example.com",
      phone: "1234567890",
      address: "Test Address",
    };

    it("should create a customer success", async () => {
      mockRepository.findAll.mockResolvedValue(Result.sucess<Customer[]>([]));

      const customer = new Customer(customerDto);
      mockRepository.create.mockResolvedValue(
        Result.sucess<Customer>(customer)
      );

      const result = await useCase.execute(customerDto);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(customer);
      expect(mockRepository.create).toHaveBeenCalledWith(customerDto);
    });

    it("should fail if email already exists", async () => {
      const existingCustomer = new Customer(customerDto);
      mockRepository.findAll.mockResolvedValue(
        Result.sucess<Customer[]>([existingCustomer])
      );

      const result = await useCase.execute(customerDto);

      expect(result.isFailure).toBe(true);
      expect(result.error?.message).toBe("El email ya está registrado");
      expect(result.error?.type).toBe(ErrorType.VALIDATION);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("should handle repository errors", async () => {
      mockRepository.findAll.mockResolvedValue(Result.sucess<Customer[]>([]));

      mockRepository.create.mockResolvedValue(
        Result.fail<Customer>("Error de base de datos", ErrorType.DATABASE)
      );

      const result = await useCase.execute(customerDto);

      expect(result.isFailure).toBe(true);
      expect(result.error?.message).toBe("Error de base de datos");
      expect(result.error?.type).toBe(ErrorType.DATABASE);
    });

    it("should handle unexpected errors", async () => {
      mockRepository.findAll.mockRejectedValue(new Error("Error inesperado"));

      const result = await useCase.execute(customerDto);

      expect(result.isFailure).toBe(true);
      expect(result.error?.message).toBe(
        "Error inesperado al crear el cliente"
      );
      expect(result.error?.type).toBe(ErrorType.INTERNAL);
    });
  });
});
