(function () {
  // ===== Elements =====
  const cartList = document.getElementById("cart-list");
  const totalPriceEl = document.getElementById("total-price");
  const userInfoDiv = document.getElementById("user-info");
  const actionsDiv = document.getElementById("cart-actions");

  // ===== State =====
  let storedData;
  try {
    storedData = JSON.parse(localStorage.getItem("user"));
  } catch {
    storedData = null;
  }

  const user = storedData?.data?.user || null;
  const isLogged = user && user.id; // აქ სწორად ამოწმებს
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

  // ===== User Info =====
  function renderUserInfo() {
    if (!userInfoDiv) return;

    // ყოველთვის actionsDiv-ის გაწმენდა
    if (actionsDiv) actionsDiv.innerHTML = "";

    if (!isLogged) {
      userInfoDiv.innerHTML = `
      <div class="auth-buttons">
        <button id="go-login">Sign In</button>
        <button id="go-register">Register</button>
      </div>
    `;
      // დალოგაუთის დროს actionsDiv არ ჩანს
      if (actionsDiv) actionsDiv.style.display = "none";

      document
        .getElementById("go-login")
        .addEventListener(
          "click",
          () => (window.location.href = "signin.html")
        );
      document
        .getElementById("go-register")
        .addEventListener(
          "click",
          () => (window.location.href = "register.html")
        );
      return;
    }

    // Logged-in user info
    userInfoDiv.innerHTML = `
    <p><strong>City:</strong> ${user.city}</p>
    <p><strong>Street:</strong> ${user.street}</p>
    <p><strong>House Number:</strong> ${user.houseNumber}</p>
    <p><strong>Payment Method:</strong> ${user.paymentMethod}</p>
  `;

    // დალოგინებულზე actionsDiv გამოჩნდება
    if (actionsDiv) actionsDiv.style.display = "block";
    renderConfirmButton();
  }

  // ===== Confirm Order =====
  function renderConfirmButton() {
    if (!actionsDiv) return;
    actionsDiv.innerHTML = "";

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Confirm";
    confirmBtn.className = "confirm-btn";

    const loader = document.createElement("div");
    loader.className = "loader hidden";

    const message = document.createElement("p");
    message.className = "order-message";

    actionsDiv.append(confirmBtn, loader, message);

    confirmBtn.addEventListener("click", async () => {
      const totalPrice = calculateTotal();
      if (totalPrice <= 0) {
        message.textContent = "❌ Cart total must be greater than 0.";
        return;
      }

      loader.classList.remove("hidden");
      confirmBtn.disabled = true;
      message.textContent = "";

      try {
        const res = await fetch(
          "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/orders/confirm",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedData?.data?.access_token}`,
            },
            body: JSON.stringify({
              items: cart.map((item) => ({
                productId: item.id,
                size: item.size || "medium",
                quantity: item.quantity || 1,
                additives: (item.additives || []).map(String), // აქაურს გადააკეთებს სტრინგებად
              })),
              totalPrice: Number(totalPrice.toFixed(2)),
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to place order");

        message.textContent = "✅ Order placed successfully!";
        message.style.color = "green";
        localStorage.removeItem("cart");
        renderCart();
      } catch (err) {
        console.error(err);
        message.textContent = "❌ Error placing order. Please try again.";
        message.style.color = "red";
      } finally {
        loader.classList.add("hidden");
        confirmBtn.disabled = false;
      }
    });
  }

  // ===== Initialize =====
  document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    renderUserInfo();
  });
})();
