export class Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) {
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.address = props.address;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
