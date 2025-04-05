import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateCustomerRequestDto {
  @ApiProperty({
    description: "Nombre del cliente",
    example: "Edilberto Roa",
  })
  @IsString()
  @IsNotEmpty()
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
    example: "Calle #123",
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
