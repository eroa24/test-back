import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Customer } from "../../../customer/domain/entities/customer.entity";
import { Product } from "../../../product/domain/entities/product.entity";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  transactionNumber: string;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column()
  status: string;

  @Column()
  paymentMethod: string;

  @Column({ nullable: true })
  paymentProviderTransactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
