export default class Order {
    constructor(id, name, quantity, createdAt, completed = false) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.createdAt = createdAt || new Date().toISOString();
        this.completed = completed; // Default to false
    }
    toJson() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            quantity: this.quantity,
            createdAt: this.createdAt,
            completed: this.completed || false
        });
    }
}
