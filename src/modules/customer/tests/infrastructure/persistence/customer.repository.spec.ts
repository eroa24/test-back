import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CustomerRepository } from "../../../infrastructure/persistence/customer.repository";
import { CustomerEntity } from "../../../infrastructure/persistence/entities/customer.entity";
import { ErrorType } from "@/common/types";

describe("CustomerRepository", () => {
  let repository: CustomerRepository;
  let typeOrmRepository: Repository<CustomerEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRepository,
        {
          provide: getRepositoryToken(CustomerEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<CustomerRepository>(CustomerRepository);
    typeOrmRepository = module.get<Repository<CustomerEntity>>(
      getRepositoryToken(CustomerEntity)
    );
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("create", () => {
    const customerDto = {
      name: "Test Customer",
      email: "test@example.com",
      phone: "1234567890",
      address: "Test Address",
    };

    it("should create a customer success", async () => {
      const savedCustomer = new CustomerEntity();
      Object.assign(savedCustomer, customerDto);
      savedCustomer.createdAt = new Date();
      savedCustomer.updatedAt = new Date();

      jest.spyOn(typeOrmRepository, "save").mockResolvedValue(savedCustomer);

      const result = await repository.create(customerDto);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(savedCustomer);
      expect(typeOrmRepository.save).toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      jest
        .spyOn(typeOrmRepository, "save")
        .mockRejectedValue(new Error("Database error"));

      const result = await repository.create(customerDto);

      expect(result.isFailure).toBe(true);
      expect(result.error?.message).toBe("Error al crear el cliente");
      expect(result.error?.type).toBe(ErrorType.DATABASE);
    });
  });

  describe("findAll", () => {
    it("should return all customers sucess", async () => {
      const customers = [
        {
          id: "1",
          name: "Customer 1",
          email: "customer1@example.com",
          phone: "1234567890",
          address: "Address 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Customer 2",
          email: "customer2@example.com",
          phone: "0987654321",
          address: "Address 2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(typeOrmRepository, "find").mockResolvedValue(customers);

      const result = await repository.findAll();

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(customers);
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      jest
        .spyOn(typeOrmRepository, "find")
        .mockRejectedValue(new Error("Database error"));

      const result = await repository.findAll();

      expect(result.isFailure).toBe(true);
      expect(result.error?.message).toBe("Error al obtener los clientes");
      expect(result.error?.type).toBe(ErrorType.DATABASE);
    });
  });
});
