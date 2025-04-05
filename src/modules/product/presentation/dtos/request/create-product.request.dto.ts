import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductRequestDto {
  @ApiProperty({
    description: "Nombre del producto",
    example: "Producto de prueba",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Descripción del producto",
    example: "Descripción detallada del producto",
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: "Precio del producto",
    example: 100.0,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: "Cantidad disponible en stock",
    example: 10,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;
}
