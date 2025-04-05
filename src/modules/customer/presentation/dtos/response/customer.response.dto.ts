import { ApiProperty } from "@nestjs/swagger";

export class CustomerResponseDto {
  @ApiProperty({
    description: "ID único del cliente",
    example: "uuid",
  })
  id: string;

  @ApiProperty({
    description: "Nombre del cliente",
    example: "Edilberto Roa",
  })
  name: string;

  @ApiProperty({
    description: "Email del cliente",
    example: "eroa@example.com",
  })
  email: string;

  @ApiProperty({
    description: "Teléfono del cliente",
    example: "+571234567890",
  })
  phone: string;

  @ApiProperty({
    description: "Dirección del cliente",
    example: "Calle 123",
  })
  address: string;

  @ApiProperty({
    description: "Fecha de creación del registro",
    example: "2024-04-05T21:09:37.679Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Fecha de última actualización",
    example: "2024-04-05T21:09:37.679Z",
  })
  updatedAt: Date;
}
