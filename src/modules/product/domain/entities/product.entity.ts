export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    name: string;
    description: string;
    price: number;
    stock: number;
  }) {
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.stock = props.stock;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
