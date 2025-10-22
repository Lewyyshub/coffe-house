// JS/headers.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");

  if (!container) return;

  // ჰედერის HTML
  const headerHTML = `
    <header>
      <div class="img-container">
        <img class="logo" src="assets/images/logo.png" alt="logo" />
      </div>
      <nav class="navbar">
        <ul class="nav">
          <li>Favorite coffee</li>
          <li>About</li>
          <li>Mobile app</li>
          <li>Contact us</li>
        </ul>
      </nav>
      <div class="cart-div">
        <a href="cart.html"><img src="assets/images/cart.png" alt="cart" /></a>
      </div>
      <div class="login-register-div">
        <a href="register.html">Register</a>
        <a href="signin.html">Sign In</a>
      </div>
      <div class="menuBtn">
        <a href="#" class="menu-link">Menu</a>
        <img class="cup" src="assets/images/cup.png" alt="cup" />
        <button class="burger" aria-label="menu">
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  `;

  container.insertAdjacentHTML("afterbegin", headerHTML);

  const cartDiv = document.querySelector(".cart-div");
  const loginRegisterDiv = document.querySelector(".login-register-div");
  const menuLink = document.querySelector(".menu-link");
  const isLogged = !!localStorage.getItem("user");
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // გვერდის შემოწმება
  const isMenuPage = window.location.pathname.includes("menu.html");

  // Menu ↔ Home ლინკი
  if (menuLink) {
    if (isMenuPage) {
      menuLink.textContent = "Home";
      menuLink.setAttribute("href", "index.html");
    } else {
      menuLink.textContent = "Menu";
      menuLink.setAttribute("href", "menu.html");
    }
  }

  // კალათის ხილვადობა
  function updateCartVisibility() {
    if (isLogged) {
      cartDiv.style.display = "block";
    } else {
      cartDiv.style.display = cart.length > 0 ? "block" : "none";
    }
  }

  // Login/Register ხილვადობა
  function updateLoginRegisterVisibility() {
    loginRegisterDiv.style.display = isLogged ? "none" : "flex";
  }

  updateCartVisibility();
  updateLoginRegisterVisibility();

  // კალათის დინამიური counter (optional)
  const cartCounter = document.createElement("span");
  cartCounter.className = "cart-counter";
  cartDiv.appendChild(cartCounter);

  function updateCartCounter() {
    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    cartCounter.textContent = totalItems;
  }

  updateCartCounter();

  // გლობალური ფუნქცია კალათაში დამატებისთვის
  window.addToCart = function (item) {
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartVisibility();
    updateCartCounter();
  };
});
