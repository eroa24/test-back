import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("products")
export class Product {
  @ApiProperty({ description: "ID único del producto" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Nombre del producto" })
  @Column()
  name: string;

  @ApiProperty({ description: "Descripción del producto" })
  @Column()
  description: string;

  @ApiProperty({ description: "Precio del producto" })
  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: "Cantidad disponible en stock" })
  @Column()
  stock: number;

  @ApiProperty({ description: "Fecha de creación del producto" })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: "Fecha de última actualización del producto" })
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(data?: Partial<Product>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
