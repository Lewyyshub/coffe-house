import { MenuProduct } from "./interfaces.js";

// ელემენტები
const modal = document.getElementById("product-modal") as HTMLDivElement;
const modalImg = document.getElementById("modal-img") as HTMLImageElement;
const modalName = document.getElementById("modal-name") as HTMLHeadingElement;
const modalDesc = document.getElementById("modal-desc") as HTMLParagraphElement;
const modalPrice = document.getElementById("modal-price") as HTMLSpanElement;
const modalSizes = modal.querySelector<HTMLDivElement>(".sizes div")!;
const modalAdditives = modal.querySelector<HTMLDivElement>(".additives div")!;
const closeBtn = modal.querySelector<HTMLButtonElement>(".close-btn")!;
const overlay = document.createElement("div");
overlay.className = "modal-overlay";

// Notification
const notification = document.createElement("div");
notification.className = "modal-error-notification";
notification.style.display = "none";
document.body.prepend(notification);

// State
let currentProduct: MenuProduct | null = null;
let selectedSize: { name: string; price: number } | null = null;
let selectedAdditives: { name: string; price: number }[] = [];
const isRegistered = !!localStorage.getItem("user");

// Functions
function showNotification(message: string) {
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

function calculateTotal(): number {
  let total = selectedSize?.price || 0;
  selectedAdditives.forEach((add) => (total += add.price));
  return total;
}

function updatePrice() {
  modalPrice.textContent = `$${calculateTotal().toFixed(2)}`;
}

function openModal(productId: number) {
  modal.appendChild(overlay);
  overlay.textContent = "Loading...";
  overlay.style.display = "flex";

  fetch(
    `http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/api/products/${productId}`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Network error");
      return res.json();
    })
    .then((product: MenuProduct) => {
      currentProduct = product;
      overlay.style.display = "none";

      modalImg.src = `assets/images/products/${product.id}.png`;
      modalName.textContent = product.name;
      modalDesc.textContent = product.description;

      // Sizes (for simplicity, assume product.sizes exists)
      modalSizes.innerHTML = "";
      const defaultSize = product.sizes?.[0] || {
        name: "S",
        price: product.price,
      };
      selectedSize = defaultSize;

      product.sizes?.forEach((size: { name: string; price: number } | null) => {
        const btn = document.createElement("button");
        if (size) {
          // size არ არის null
          btn.textContent = `${size.name} ${size.price?.toFixed(2) ?? 0}$`;
          if (defaultSize && size.name === defaultSize.name)
            btn.classList.add("active");
        }

        btn.addEventListener("click", () => {
          selectedSize = size;
          Array.from(modalSizes.children).forEach((b) =>
            b.classList.remove("active")
          );
          btn.classList.add("active");
          updatePrice();
        });

        modalSizes.appendChild(btn);
      });

      // Additives
      modalAdditives.innerHTML = "";
      product.additives?.forEach((add: { name: any; price?: number }) => {
        const btn = document.createElement("button");
        btn.textContent = add.name;

        btn.addEventListener("click", () => {
          const index = selectedAdditives.findIndex((a) => a.name === add.name);
          if (index >= 0) {
            selectedAdditives.splice(index, 1);
            btn.classList.remove("active");
          }
          if (add.price !== undefined) {
            selectedAdditives.push({ name: add.name, price: add.price });
          }
          updatePrice();
        });

        modalAdditives.appendChild(btn);
      });

      updatePrice();
      modal.style.display = "flex";
    })
    .catch((err) => {
      console.error(err);
      overlay.style.display = "none";
      showNotification("Something went wrong. Please, try again");
    });
}

// Close modal
function closeModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
  selectedAdditives = [];
  selectedSize = null;
  currentProduct = null;
}

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Add to cart (for demo, console log)
const addToCartBtn = document.createElement("button");
addToCartBtn.textContent = "Add to Cart";
modal.querySelector(".modal-info")?.appendChild(addToCartBtn);
addToCartBtn.addEventListener("click", () => {
  if (!currentProduct || !selectedSize) return;
  const cartItem = {
    productId: currentProduct.id,
    name: currentProduct.name,
    size: selectedSize.name,
    additives: selectedAdditives.map((a) => a.name),
    total: calculateTotal(),
  };
  console.log("Added to cart:", cartItem);
  closeModal();
});

// Example: attach openModal to product cards dynamically
document.querySelectorAll(".products").forEach((card) => {
  card.addEventListener("click", () => {
    const id = Number(card.getAttribute("data-id"));
    openModal(id);
  });
});
