import Order from "./orderObj.js";
const ORDERS_KEY = "orders";
export function getOrders() {
    const data = localStorage.getItem(ORDERS_KEY);
    if (!data)
        return [];
    const rawOrders = JSON.parse(data);
    return rawOrders.map((o) => new Order(o.id, o.name, o.quantity, o.createdAt, o.completed));
}
export function generateOrderId() {
    const today = new Date().toISOString().slice(0, 10);
    let lastDate = localStorage.getItem("lastDate");
    let lastId = Number(localStorage.getItem("lastId")) || 1;
    if (lastDate !== today) {
        lastDate = today;
        lastId = 1;
    }
    const newId = lastId % 1000;
    localStorage.setItem("lastDate", lastDate);
    return newId;
}
