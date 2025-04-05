import { ApiProperty } from "@nestjs/swagger";

export class ProductResponseDto {
  @ApiProperty({
    description: "ID único del producto (UUID)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Nombre del producto",
    example: "Producto de prueba",
  })
  name: string;

  @ApiProperty({
    description: "Descripción del producto",
    example: "Descripción detallada del producto",
  })
  description: string;

  @ApiProperty({
    description: "Precio del producto",
    example: 100.0,
  })
  price: number;

  @ApiProperty({
    description: "Cantidad disponible en stock",
    example: 10,
  })
  stock: number;

  @ApiProperty({
    description: "Fecha de creación del producto",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Fecha de última actualización del producto",
  })
  updatedAt: Date;
}
