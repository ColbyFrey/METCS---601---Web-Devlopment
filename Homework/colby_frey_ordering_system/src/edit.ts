import Order from "./orderObj.js";
import { getOrders } from "./orderHelper.js";

const ORDERS_KEY = "orders";

function saveOrders(orders: Order[]) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function renderEditOrders() {
    const orders = getOrders();
    const tbody = document.querySelector("#editOrdersTable tbody");
    const noOrdersDiv = document.getElementById("noOrdersEdit");

    if (!tbody || !noOrdersDiv) return;

    tbody.innerHTML = "";

    if (orders.length === 0) {
        noOrdersDiv.style.display = "block";
    } else {
        noOrdersDiv.style.display = "none";
        orders.forEach((order) => {
            const tr = document.createElement("tr");
            const ready = order.completed ? "" : `<img src="../assets/ready.png" class="complete-btn orderStatusIcon" alt="Ready" data-id="${order.id}" style="cursor:pointer; width:24px;"/>`
            tr.innerHTML = `
        <td>${order.id}</td>
        <td><input type="text" value="${order.name}" data-id="${order.id}" class="edit-name" disabled /></td>
        <td><input type="number" min="1" value="${order.quantity}" data-id="${order.id}" class="edit-quantity" disabled /></td>
        <td>
          <img src="../assets/edit.png" alt="Edit" class="edit-btn" data-id="${order.id}" style="cursor:pointer; width:24px; margin-right:8px;" />
          ${ready}
          <img src="../assets/delete.png" alt="Delete" class="delete-btn" data-id="${order.id}" style="cursor:pointer; width:24px;" />
        </td>
      `;
            tbody.appendChild(tr);
        });
    }
}


function updateOrder(id: number, name: string, quantity: number) {
    const orders = getOrders();
    const updatedOrders = orders.map((order) =>
        order.id === id ? new Order(order.id, name, quantity, order.createdAt) : order
    );
    saveOrders(updatedOrders);
    renderEditOrders();
}
function completeOrder(id: number) {
    const orders = getOrders();
    const updatedOrders = orders.map((order) =>
        order.id === id ? new Order(order.id, order.name, order.quantity, order.createdAt, true) : order
    );
    saveOrders(updatedOrders);
    renderEditOrders();
}


function deleteOrder(id: number) {
    const orders = getOrders();
    const filteredOrders = orders.filter((order) => order.id !== id);
    saveOrders(filteredOrders);
    renderEditOrders();
}

function setupEventListeners() {
    const editTable = document.getElementById("editOrdersTable");
    editTable?.addEventListener("click", (e) => {
        const target = e.target as HTMLImageElement;

        // Edit button clicked
        if (target.classList.contains("edit-btn")) {
            const id = Number(target.getAttribute("data-id"));
            if (!id) return;

            // Enable inputs in this row
            const nameInput = document.querySelector(`.edit-name[data-id="${id}"]`) as HTMLInputElement;
            const quantityInput = document.querySelector(`.edit-quantity[data-id="${id}"]`) as HTMLInputElement;

            if (nameInput && quantityInput) {
                nameInput.disabled = false;
                quantityInput.disabled = false;
                nameInput.focus();

                // Change edit icon to save icon
                target.src = "../assets/save.png";
                target.alt = "Save";
                target.classList.remove("edit-btn");
                target.classList.add("save-btn");
            }
        }
        // Save button clicked
        else if (target.classList.contains("save-btn")) {
            const id = Number(target.getAttribute("data-id"));
            if (!id) return;

            const nameInput = document.querySelector(`.edit-name[data-id="${id}"]`) as HTMLInputElement;
            const quantityInput = document.querySelector(`.edit-quantity[data-id="${id}"]`) as HTMLInputElement;

            if (nameInput && quantityInput) {
                const newName = nameInput.value.trim();
                const newQuantity = parseInt(quantityInput.value, 10);
                if (newName && newQuantity >= 1) {
                    updateOrder(id, newName, newQuantity);

                    // Disable inputs again
                    nameInput.disabled = true;
                    quantityInput.disabled = true;

                    // Change save icon back to edit icon
                    target.src = "../assets/edit.png";
                    target.alt = "Edit";
                    target.classList.remove("save-btn");
                    target.classList.add("edit-btn");
                } else {
                    alert("Please enter a valid name and quantity >= 1");
                    nameInput.focus();
                }
            }
        }
        // Delete button clicked
        else if (target.classList.contains("delete-btn")) {
            const id = Number(target.getAttribute("data-id"));
            if (confirm("Are you sure you want to delete this order?")) {
                deleteOrder(id);
            }
        }
        else if (target.classList.contains("complete-btn")) {
            const id = Number(target.getAttribute("data-id"));
            alert("Order completed successfully!");
            completeOrder(id);
        }
    });
}




document.addEventListener("DOMContentLoaded", () => {
    renderEditOrders();
    setupEventListeners();
});