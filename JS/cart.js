const cartIcon = document.getElementById("cart-icon");
const cartCounter = document.getElementById("cart-counter");
const cartList = document.getElementById("cart-list");
const confirmOrderBtn = document.getElementById("confirm-order");
const loader = document.createElement("div");
loader.className = "cart-loader";
loader.textContent = "Processing...";
const notification = document.createElement("div");
notification.className = "cart-notification";
document.body.prepend(notification);
const isLogged = !!localStorage.getItem("user");
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
// Functions
function showNotification(message) {
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => (notification.style.display = "none"), 3000);
}
function updateCartIcon() {
    if (isLogged || cart.length > 0) {
        cartIcon.style.display = "flex";
        cartCounter.textContent = cart.length.toString();
    }
    else {
        cartIcon.style.display = "none";
    }
}
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIcon();
}
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}
function renderCart() {
    cartList.innerHTML = "";
    if (cart.length === 0) {
        cartList.innerHTML = "<p>Your cart is empty</p>";
        if (!isLogged)
            renderAuthPrompt();
        return;
    }
    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        const additives = item.additives.length
            ? `Extras: ${item.additives.join(", ")}`
            : "";
        div.innerHTML = `
      <p>${item.name}</p>
      <p>Size: ${item.size}</p>
      <p>${additives}</p>
      <p>Price: $${isLogged && item.discountedTotal
            ? item.discountedTotal.toFixed(2)
            : item.total.toFixed(2)}</p>
      <button class="remove-btn">🗑️</button>
    `;
        div
            .querySelector(".remove-btn")
            .addEventListener("click", () => removeItem(index));
        cartList.appendChild(div);
    });
    renderCheckout();
}
function renderAuthPrompt() {
    const authDiv = document.createElement("div");
    authDiv.className = "auth-prompt";
    authDiv.innerHTML = `
    <button onclick="window.location.href='login.html'">Sign In</button>
    <button onclick="window.location.href='register.html'">Register</button>
  `;
    cartList.appendChild(authDiv);
}
function renderCheckout() {
    if (!isLogged)
        return;
    const total = cart.reduce((sum, item) => sum + (item.discountedTotal || item.total), 0);
    const checkoutDiv = document.createElement("div");
    checkoutDiv.className = "checkout";
    checkoutDiv.innerHTML = `
    <p>Delivery Address: 123 Coffee St., City</p>
    <p>Total: $${total.toFixed(2)}</p>
  `;
    checkoutDiv.appendChild(confirmOrderBtn);
    cartList.appendChild(checkoutDiv);
}
// Confirm Order
confirmOrderBtn.addEventListener("click", async () => {
    cartList.appendChild(loader);
    try {
        const res = await fetch("http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ items: cart }),
        });
        if (!res.ok)
            throw new Error("Network error");
        cart = [];
        saveCart();
        renderCart();
        alert("Thank you for your order! Our manager will contact you shortly.");
    }
    catch (err) {
        console.error(err);
        showNotification("Something went wrong. Please, try again");
    }
    finally {
        loader.remove();
    }
});
// Init
updateCartIcon();
renderCart();
export {};
//# sourceMappingURL=cart.js.map
