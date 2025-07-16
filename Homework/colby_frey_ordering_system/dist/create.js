import Order from "./orderObj.js";
import { generateOrderId, getOrders } from "./orderHelper.js";
const ORDERS_KEY = "orders";
function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
function populateCreateOrderForm() {
    const orderIdInput = document.getElementById("orderId");
    const orderDateInput = document.getElementById("orderDateTime");
    if (!orderIdInput || !orderDateInput)
        return;
    const nextId = generateOrderId();
    orderIdInput.value = nextId.toString();
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    orderDateInput.value = now.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
}
function addOrder(name, quantity, id, createdAt) {
    const orders = getOrders();
    const order = new Order(id, name, quantity, createdAt);
    orders.push(order);
    saveOrders(orders);
}
function setupEventListeners() {
    const form = document.getElementById("orderForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("orderName").value.trim();
        const quantity = parseInt(document.getElementById("orderQuantity").value, 10);
        const id = parseInt(document.getElementById("orderId").value, 10);
        const createdAtStr = document.getElementById("orderDateTime").value;
        if (!name || !quantity || quantity < 1 || isNaN(id) || !createdAtStr)
            return;
        const createdAt = new Date(createdAtStr).toISOString();
        addOrder(name, quantity, id, createdAt);
        form.reset();
        alert("Order created successfully!");
    });
    form.addEventListener("reset", () => {
        populateCreateOrderForm();
    });
}
document.addEventListener("DOMContentLoaded", () => {
    populateCreateOrderForm();
    setupEventListeners();
});
