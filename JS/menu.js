const productsContainer = document.getElementById("products-container");
const filterDivs = document.querySelectorAll(".filter div");
const modal = document.getElementById("product-modal");
const modalName = modal.querySelector("#modal-name");
const modalDesc = modal.querySelector("#modal-desc");
const modalPrice = modal.querySelector("#modal-price");
const modalCloseBtn = modal.querySelector(".close-btn");
const modalSizesDiv = modal.querySelector(".sizes > div");
const modalExtrasDiv = modal.querySelector(".additives > div");

let allProducts = [];
let currentCategory = "Coffee";

// Loader
const loader = document.createElement("div");
loader.className = "loader";
loader.textContent = "Loading...";
productsContainer.appendChild(loader);

// Create product card
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  // კატეგორია ყოველთვის პატარა ასოებით
  const category = (product.category || "coffee").toLowerCase().trim();

  // შესაბამისი ფოლდერი
  let folderName = "coffe-images"; // default
  if (category === "tea") folderName = "tea-images";
  else if (category === "dessert") folderName = "dessert-images";

  // ფოტო ID-ის მიხედვით (.jpg)
  const imagePath = `/assets/${folderName}/${product.id}.jpg`;

  card.innerHTML = `
    <img src="${imagePath}" alt="${product.name}" />
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <p class="price">$${Number(product.price).toFixed(2)}</p>
  `;

  card.addEventListener("click", () => openModal(product));
  return card;
}

// Render products
function renderProducts(products) {
  productsContainer.innerHTML = "";
  if (!products.length) {
    productsContainer.innerHTML = "<p>No products found in this category.</p>";
    return;
  }
  products.forEach((p) => productsContainer.appendChild(createProductCard(p)));
}

// Filter
filterDivs.forEach((div) => {
  div.addEventListener("click", () => {
    filterDivs.forEach((d) => d.classList.remove("active"));
    div.classList.add("active");
    currentCategory = div.textContent.trim();
    filterAndRender();
  });
});

function filterAndRender() {
  const filteredProducts = allProducts.filter(
    (p) => p.category.toLowerCase() === currentCategory.toLowerCase()
  );
  renderProducts(filteredProducts);
}

// Fetch products from API
async function fetchProducts() {
  productsContainer.innerHTML = "";
  productsContainer.appendChild(loader);

  try {
    const res = await fetch(
      "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/products"
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    allProducts = Array.isArray(result.data) ? result.data : [];
    filterAndRender();
  } catch (err) {
    productsContainer.innerHTML =
      "<div class='error'>Something went wrong. Please refresh the page.</div>";
    console.error(err);
  }
}

// Modal logic
async function openModal(product) {
  console.log("Clicked product:", product.name);

  try {
    const res = await fetch(
      `http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/products/${product.id}`
    );
    if (!res.ok) throw new Error("Failed to fetch full product info");
    const data = await res.json();
    const fullProduct = data.data;
    console.log("Full product:", fullProduct);

    // კატეგორია პატარა ასოებით
    const category = (fullProduct.category || "coffee").toLowerCase().trim();

    // შესაბამისი ფოლდერი
    let folderName = "coffe-images";
    if (category === "tea") folderName = "tea-images";
    else if (category === "dessert") folderName = "dessert-images";

    // სურათი ID-ის მიხედვით (.jpg)
    const imagePath = `/assets/${folderName}/${fullProduct.id}.jpg`;

    // დაამატე სურათი მოდალში
    const modalImage = modal.querySelector("#modal-img");
    if (modalImage) {
      modalImage.src = imagePath;
      modalImage.alt = fullProduct.name;
    }

    // დაამატე სახელები და აღწერა
    modalName.textContent = fullProduct.name;
    modalDesc.textContent = fullProduct.description;

    // წინა ღილაკები წავშალოთ
    modalSizesDiv.innerHTML = "";
    modalExtrasDiv.innerHTML = "";

    // --- Size ღილაკები ---
    if (fullProduct.sizes && Object.keys(fullProduct.sizes).length > 0) {
      Object.entries(fullProduct.sizes).forEach(([key, size], index) => {
        const btn = document.createElement("button");
        const price = size.discountPrice || size.price;
        btn.textContent = ` ${size.size} `;
        btn.dataset.price = price;
        if (index === 0) btn.classList.add("active");
        modalSizesDiv.appendChild(btn);
      });
    } else {
      modalSizesDiv.textContent = "No size options";
    }

    // --- Additives ღილაკები ---
    if (fullProduct.additives && fullProduct.additives.length > 0) {
      fullProduct.additives.forEach((extra) => {
        const btn = document.createElement("button");
        btn.textContent = `${extra.name} `;
        btn.dataset.price = extra.price;
        modalExtrasDiv.appendChild(btn);
      });
    } else {
      modalExtrasDiv.textContent = "No additives available";
    }

    // --- ფასის დინამიური გამოთვლა ---
    function updatePrice() {
      let total = 0;

      const activeSize = modalSizesDiv.querySelector("button.active");
      if (activeSize) total += parseFloat(activeSize.dataset.price || "0");

      modalExtrasDiv.querySelectorAll("button.active").forEach((btn) => {
        total += parseFloat(btn.dataset.price || "0");
      });

      modalPrice.textContent = `$${total.toFixed(2)}`;
    }

    // ღილაკების ქცევა
    modalSizesDiv.onclick = (e) => {
      const target = e.target;
      if (target.tagName === "BUTTON") {
        modalSizesDiv
          .querySelectorAll("button")
          .forEach((b) => b.classList.remove("active"));
        target.classList.add("active");
        updatePrice();
      }
    };

    modalExtrasDiv.onclick = (e) => {
      const target = e.target;
      if (target.tagName === "BUTTON") {
        target.classList.toggle("active");
        updatePrice();
      }
    };

    updatePrice();
    modal.classList.add("open");
  } catch (err) {
    console.error("Error opening modal:", err);
  }
}

// Close modal
modalCloseBtn.addEventListener("click", () => modal.classList.remove("open"));
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.classList.remove("open");
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("open");
});

// Initialize
document.addEventListener("DOMContentLoaded", fetchProducts);
document.addEventListener("DOMContentLoaded", function () {
  const cartDiv = document.querySelector(".cart-div");
  const loginRegisterDiv = document.querySelector(".login-register-div");
  const isLogged = !!localStorage.getItem("user");
  const cartCounter = document.createElement("span");
  cartCounter.className = "cart-counter";

  // კალათის აიქონი და login/register ღილაკების კონტროლი
  if (cartDiv) {
    if (isLogged) {
      cartDiv.style.display = "block";
      cartDiv.appendChild(cartCounter);
    } else {
      cartDiv.style.display = "none";
    }
  }

  if (loginRegisterDiv) {
    if (isLogged) {
      loginRegisterDiv.style.display = "none";
    } else {
      loginRegisterDiv.style.display = "flex";
    }
  }

  // კალათის მონაცემები LocalStorage-დან
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  updateCartCounter();

  // ფუნქცია კალათის counter-ის განახლებაზე
  function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
    // კალათის აიქონი გამოჩნდეს პირველ დამატებაზე, თუ მომხმარებელი არ არის დალოგინებული
    if (!isLogged && totalItems > 0) {
      cartDiv.style.display = "block";
    }
  }

  // პროდუქტების კოდის ბოლოს ან modal-ში დაემატება ღილაკი "Add to cart"
  // მაგალითად, აქ არის Modal-ში:
  // მოდალის ბოლოს დაამატე ღილაკი Add to Cart
  const addToCartBtn = document.createElement("button");
  addToCartBtn.textContent = "Add to Cart";
  addToCartBtn.className = "add-to-cart-btn";

  // დაამატე ღილაკი .modal-info-ში Close ღილაკის ზემოთ
  const closeBtn = modal.querySelector(".close-btn");
  modal.querySelector(".modal-info").insertBefore(addToCartBtn, closeBtn);

  // დაამატე ფუნქციონალი
  addToCartBtn.addEventListener("click", () => {
    const activeSize = modalSizesDiv.querySelector("button.active");
    const extras = Array.from(
      modalExtrasDiv.querySelectorAll("button.active")
    ).map((b) => ({
      name: b.textContent.trim(),
      price: parseFloat(b.dataset.price),
    }));

    const modalImage = document.querySelector("#modal-img");
    const imageSrc = modalImage ? modalImage.src : "assets/images/rame.png";

    const productToAdd = {
      id: modal.dataset.productId || Math.random(),
      name: modalName.textContent,
      size: activeSize ? activeSize.textContent.trim() : "",
      extras,
      price: parseFloat(modalPrice.textContent.replace("$", "")),
      quantity: 1,
      image: imageSrc, // 📸 ფოტო გადავა კალათაში
    };

    cart.push(productToAdd);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
    alert("Product added to cart!");
  });
});
