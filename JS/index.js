// ელემენტები
const swiperTrack = document.querySelector(".swiper-track");
const prevBtn = document.querySelector(".swiper-btn.prev");
const nextBtn = document.querySelector(".swiper-btn.next");
// Loader
const loader = document.createElement("div");
loader.textContent = "Loading...";
loader.className = "loader";
swiperTrack.appendChild(loader);
// State
let slides = [];
let currentIndex = 0;
// Functions
function showSlide(index) {
  const slideElements = swiperTrack.querySelectorAll(".swiper-slide");
  slideElements.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}
function createSlide(item) {
  const name = item.name || "No name";
  const description = item.description || "";
  const image = item.image || `/assets/images/${item.id}.png`; // დარწმუნდი, რომ path არსებობს
  const price = item.price != null ? Number(item.price).toFixed(2) : "N/A";

  const slide = document.createElement("div");
  slide.className = "swiper-slide";
  slide.innerHTML = `
    <img src="${image}" alt="${name}" />
    <p>${name}</p>
    <span>${description}</span>
    <p>$${price}</p>
  `;
  return slide;
}

// Fetch Data
async function fetchFavorites() {
  try {
    const res = await fetch(
      "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/products/favorites",
      { headers: { Accept: "application/json" } }
    );

    if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);

    const data = await res.json();
    console.log("Fetched data:", data);

    // სწორად ვიღებთ array-ს
    const favorites = Array.isArray(data.data) ? data.data : [];

    slides = favorites.slice(0, 3);
    swiperTrack.innerHTML = "";
    slides.forEach((item) => swiperTrack.appendChild(createSlide(item)));
    showSlide(currentIndex);
  } catch (err) {
    console.error(err);
    swiperTrack.innerHTML = `<div class="error">Something went wrong. Please, refresh the page</div>`;
  }
}

// Slider navigation
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
});
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
});
// Init
document.addEventListener("DOMContentLoaded", fetchFavorites);
export {};
//# sourceMappingURL=index.js.map
