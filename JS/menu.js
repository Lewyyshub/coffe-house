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
  card.innerHTML = `
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <p class="price">$${Number(product.price).toFixed(2)}</p>
  `;
  // Modal open
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

  // პირველ რიგში წამოიღე დეტალური ინფორმაცია
  try {
    const res = await fetch(
      `http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/products/${product.id}`
    );
    if (!res.ok) throw new Error("Failed to fetch full product info");
    const data = await res.json();
    const fullProduct = data.data;
    console.log("Full product:", fullProduct);

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

    // საწყისი ფასი
    updatePrice();

    // მოდალის გახსნა
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
