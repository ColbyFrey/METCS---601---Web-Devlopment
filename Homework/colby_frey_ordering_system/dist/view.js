import { getOrders } from "./orderHelper.js";
function renderViewOrders() {
    const orders = getOrders();
    const tbody = document.querySelector("#ordersTable tbody");
    const noOrdersDiv = document.getElementById("noOrdersView");
    const ready = '<img src="../assets/ready.png" class="orderStatusIcon" alt="Ready"/>';
    const wip = '<img src="../assets/wip.png" class="orderStatusIcon" alt="In Progress"/>';
    if (!tbody || !noOrdersDiv)
        return;
    tbody.innerHTML = "";
    if (orders.length === 0) {
        noOrdersDiv.style.display = "block";
    }
    else {
        noOrdersDiv.style.display = "none";
        orders.forEach((order) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.name}</td>
        <td>${order.quantity}</td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
        <td>${order.completed ? ready : wip}</td>
      `;
            tbody.appendChild(tr);
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    renderViewOrders();
});
