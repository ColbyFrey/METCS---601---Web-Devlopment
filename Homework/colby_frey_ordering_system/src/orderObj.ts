export default class Order {
  id: number;
  name: string;
  quantity: number;
  createdAt: string; 
  completed: boolean;

  constructor(id: number, name: string, quantity: number, createdAt?: string, completed: boolean = false) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.createdAt = createdAt || new Date().toISOString();
    this.completed = completed; // Default to false
  }
  

  toJson(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      quantity: this.quantity,
      createdAt: this.createdAt,
      completed: this.completed || false
    });
  }
}
