import { Test, TestingModule } from "@nestjs/testing";
import { GetAllCustomersUseCase } from "../../../application/use-cases/get-all-customers.use-case";
import { ICustomerRepository } from "../../../domain/repositories/customer.repository.interface";
import { Customer } from "../../../domain/entities/customer.entity";
import { Result } from "@/common/types";
import { ErrorType } from "@/common/types";

describe("GetAllCustomersUseCase", () => {
  let useCase: GetAllCustomersUseCase;
  let mockRepository: jest.Mocked<ICustomerRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllCustomersUseCase,
        {
          provide: "ICustomerRepository",
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllCustomersUseCase>(GetAllCustomersUseCase);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should return all customers success", async () => {
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

      mockRepository.findAll.mockResolvedValue(
        Result.sucess<Customer[]>(customers)
      );

      const result = await useCase.execute();

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(customers);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it("should handle repository errors", async () => {
      mockRepository.findAll.mockResolvedValue(
        Result.fail<Customer[]>("Error de base de datos", ErrorType.DATABASE)
      );

      const result = await useCase.execute();

      expect(result.isFailure).toBe(true);
      expect(result.error?.message).toBe("Error de base de datos");
      expect(result.error?.type).toBe(ErrorType.DATABASE);
    });

    it("should handle unexpected errors", async () => {
      mockRepository.findAll.mockRejectedValue(new Error("Error inesperado"));

      const result = await useCase.execute();

      expect(result.isFailure).toBe(true);
      expect(result.error?.message).toBe(
        "Error inesperado al obtener los clientes"
      );
      expect(result.error?.type).toBe(ErrorType.INTERNAL);
    });
  });
});
