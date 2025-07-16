import Order from "./orderObj.js";
import { generateOrderId, getOrders } from "./orderHelper.js";

const ORDERS_KEY = "orders";

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function populateCreateOrderForm() {
  const orderIdInput = document.getElementById("orderId") as HTMLInputElement | null;
  const orderDateInput = document.getElementById("orderDateTime") as HTMLInputElement | null;

  if (!orderIdInput || !orderDateInput) return;

  const nextId = generateOrderId();
  orderIdInput.value = nextId.toString();

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  orderDateInput.value = now.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
}

function addOrder(name: string, quantity: number, id: number, createdAt: string) {
  const orders = getOrders();
  const order = new Order(id, name, quantity, createdAt);
  orders.push(order);
  saveOrders(orders);
}

function setupEventListeners() {
  const form = document.getElementById("orderForm") as HTMLFormElement;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (document.getElementById("orderName") as HTMLInputElement).value.trim();
    const quantity = parseInt((document.getElementById("orderQuantity") as HTMLInputElement).value, 10);
    const id = parseInt((document.getElementById("orderId") as HTMLInputElement).value, 10);
    const createdAtStr = (document.getElementById("orderDateTime") as HTMLInputElement).value;

    if (!name || !quantity || quantity < 1 || isNaN(id) || !createdAtStr) return;

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
