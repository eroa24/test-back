## Estructura del Proyecto

El proyecto sigue una arquitectura hexagonal (puertos y adaptadores) con los siguientes módulos:

```
src/
└── modules/
    ├── product/                    # Módulo de productos
    │   ├── domain/
    │   │   ├── entities/          # Entidades de dominio
    │   │   └── repositories/      # Interfaces de repositorios
    │   ├── application/
    │   │   └── use-cases/        # Casos de uso
    │   ├── infrastructure/
    │   │   └── persistence/      # Implementaciones de repositorios
    │   ├── presentation/
    │   │   ├── controllers/      # Controladores REST
    │   │   └── dtos/            # Objetos de transferencia de datos
    │   └── tests/                # Tests por capa
    │
    ├── transaction/              # Módulo de transacciones
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   ├── presentation/
    │   └── tests/
    │
    ├── customer/                 # Módulo de clientes
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   ├── presentation/
    │   └── tests/
    │
    ├── delivery/                 # Módulo de entregas
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   ├── presentation/
    │   └── tests/
    │
    └── payment/                 # Módulo de integración con pasarela de pagos
        ├── domain/
        ├── application/
        ├── infrastructure/
        ├── presentation/
        └── tests/
```
