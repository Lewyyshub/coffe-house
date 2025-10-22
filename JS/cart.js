(function () {
  // ===== Elements =====
  const cartList = document.getElementById("cart-list");
  const totalPriceEl = document.getElementById("total-price");

  // ===== State =====
  const isLogged = !!localStorage.getItem("user");
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // ===== Functions =====
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
  }

  function calculateTotal() {
    return cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  }

  function renderCart() {
    if (!cartList) return;
    cartList.innerHTML = "";

    if (cart.length === 0) {
      cartList.innerHTML = "<p>Your cart is empty</p>";
      if (totalPriceEl) totalPriceEl.textContent = "$0.00";
      return;
    }

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "selected-product";

      const extras =
        item.extras && item.extras.length
          ? "Extras: " + item.extras.map((e) => e.name).join(", ")
          : "";

      const price = item.price.toFixed(2);

      div.innerHTML = `
        <div class="left-side">
          <div class="trash-div"><img src="assets/images/trash.png" alt="trash"></div>
          <div class="img-div"><img src="${
            item.image || "assets/images/rame.png"
          }" alt="${item.name}"></div>
          <div class="name-description">
            <p>${item.name}</p>
            <span>${item.size}${extras ? ", " + extras : ""}</span>
          </div>
        </div>
        <div class="right-side">
          <p>$${price}</p>
        </div>
      `;

      div
        .querySelector(".trash-div")
        .addEventListener("click", () => removeItem(index));

      cartList.appendChild(div);
    });

    if (totalPriceEl)
      totalPriceEl.textContent = `$${calculateTotal().toFixed(2)}`;
  }

  // ===== Initialize =====
  document.addEventListener("DOMContentLoaded", renderCart);
})();
