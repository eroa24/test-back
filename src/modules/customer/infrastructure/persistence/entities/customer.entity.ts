import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("customers")
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "ID único del cliente" })
  id: number;

  @Column()
  @ApiProperty({ description: "Nombre del cliente" })
  name: string;

  @Column()
  @ApiProperty({ description: "Email del cliente" })
  email: string;

  @Column()
  @ApiProperty({ description: "Teléfono del cliente" })
  phone: string;

  @Column()
  @ApiProperty({ description: "Dirección del cliente" })
  address: string;

  @CreateDateColumn()
  @ApiProperty({ description: "Fecha de creación del cliente" })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
