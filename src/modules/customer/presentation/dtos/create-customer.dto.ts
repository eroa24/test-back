import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateCustomerDto {
  @ApiProperty({
    description: "Nombre del cliente",
    example: "Edilberto Roa",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: "Email del cliente",
    example: "eroa@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Teléfono del cliente",
    example: "+5734567890",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: "Dirección del cliente",
    example: "Calle 123",
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
