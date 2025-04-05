## Estructura del Proyecto

El proyecto sigue una arquitectura hexagonal (puertos y adaptadores) con los siguientes módulos:

```
src/
└── modules/
    ├── product/                    # Product module
    │   ├── domain/
    │   │   ├── entities/          # Domain entities
    │   │   └── repositories/      # Repository interface
    │   ├── application/
    │   │   └── use-cases/        # Use cases (business logic)
    │   ├── infrastructure/
    │   │   └── persistence/      # Repository implementations
    │   ├── presentation/
    │   │   ├── controllers/      # REST controllers
    │   │   └── dtos/            # Data transfer object
    │   └── tests/                # Tests
    │
    ├── transaction/              # Transaction module
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   ├── presentation/
    │   └── tests/
    │
    ├── customer/                 # Customer modulo
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   ├── presentation/
    │   └── tests/
    │
    ├── delivery/                 # Delivery module
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   ├── presentation/
    │   └── tests/
    │
    └── payment/                 # Integration payments
        ├── domain/
        ├── application/
        ├── infrastructure/
        ├── presentation/
        └── tests/
```
