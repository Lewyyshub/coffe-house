var _a;
// ელემენტები
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-img");
const modalName = document.getElementById("modal-name");
const modalDesc = document.getElementById("modal-desc");
const modalPrice = document.getElementById("modal-price");
const modalSizes = modal.querySelector(".sizes div");
const modalAdditives = modal.querySelector(".additives div");
const closeBtn = modal.querySelector(".close-btn");
const overlay = document.createElement("div");
overlay.className = "modal-overlay";
// Notification
const notification = document.createElement("div");
notification.className = "modal-error-notification";
notification.style.display = "none";
document.body.prepend(notification);
// State
let currentProduct = null;
let selectedSize = null;
let selectedAdditives = [];
const isRegistered = !!localStorage.getItem("user");
// Functions
function showNotification(message) {
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}
function calculateTotal() {
    let total = (selectedSize === null || selectedSize === void 0 ? void 0 : selectedSize.price) || 0;
    selectedAdditives.forEach((add) => (total += add.price));
    return total;
}
function updatePrice() {
    modalPrice.textContent = `$${calculateTotal().toFixed(2)}`;
}
function openModal(productId) {
    modal.appendChild(overlay);
    overlay.textContent = "Loading...";
    overlay.style.display = "flex";
    fetch(`http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/api/products/${productId}`)
        .then((res) => {
        if (!res.ok)
            throw new Error("Network error");
        return res.json();
    })
        .then((product) => {
        var _a, _b, _c;
        currentProduct = product;
        overlay.style.display = "none";
        modalImg.src = `assets/images/products/${product.id}.png`;
        modalName.textContent = product.name;
        modalDesc.textContent = product.description;
        // Sizes (for simplicity, assume product.sizes exists)
        modalSizes.innerHTML = "";
        const defaultSize = ((_a = product.sizes) === null || _a === void 0 ? void 0 : _a[0]) || {
            name: "S",
            price: product.price,
        };
        selectedSize = defaultSize;
        (_b = product.sizes) === null || _b === void 0 ? void 0 : _b.forEach((size) => {
            var _a, _b;
            const btn = document.createElement("button");
            if (size) {
                // size არ არის null
                btn.textContent = `${size.name} ${(_b = (_a = size.price) === null || _a === void 0 ? void 0 : _a.toFixed(2)) !== null && _b !== void 0 ? _b : 0}$`;
                if (defaultSize && size.name === defaultSize.name)
                    btn.classList.add("active");
            }
            btn.addEventListener("click", () => {
                selectedSize = size;
                Array.from(modalSizes.children).forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                updatePrice();
            });
            modalSizes.appendChild(btn);
        });
        // Additives
        modalAdditives.innerHTML = "";
        (_c = product.additives) === null || _c === void 0 ? void 0 : _c.forEach((add) => {
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
    if (e.key === "Escape")
        closeModal();
});
// Add to cart (for demo, console log)
const addToCartBtn = document.createElement("button");
addToCartBtn.textContent = "Add to Cart";
(_a = modal.querySelector(".modal-info")) === null || _a === void 0 ? void 0 : _a.appendChild(addToCartBtn);
addToCartBtn.addEventListener("click", () => {
    if (!currentProduct || !selectedSize)
        return;
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
export {};
