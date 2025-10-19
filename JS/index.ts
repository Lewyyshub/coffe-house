import { FavoriteCoffee } from "./interfaces.js";

// ელემენტები
const swiperTrack = document.querySelector<HTMLDivElement>(".swiper-track")!;
const prevBtn = document.querySelector<HTMLButtonElement>(".swiper-btn.prev")!;
const nextBtn = document.querySelector<HTMLButtonElement>(".swiper-btn.next")!;

// Loader
const loader = document.createElement("div");
loader.textContent = "Loading...";
loader.className = "loader";
swiperTrack.appendChild(loader);

// State
let slides: FavoriteCoffee[] = [];
let currentIndex = 0;

// Functions
function showSlide(index: number) {
  const slideElements =
    swiperTrack.querySelectorAll<HTMLDivElement>(".swiper-slide");
  slideElements.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

function createSlide(item: FavoriteCoffee): HTMLDivElement {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";

  slide.innerHTML = `
    <img src="${item.image}" alt="${item.name}" />
    <p>${item.name}</p>
    <span>${item.description}</span>
    <p>$${item.price.toFixed(2)}</p>
  `;

  return slide;
}

// Fetch Data
async function fetchFavorites() {
  try {
    const res = await fetch(
      "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/api/favorites"
    );
    if (!res.ok) throw new Error("Network response was not ok");
    const data: FavoriteCoffee[] = await res.json();

    slides = data.slice(0, 3); // მხოლოდ 3 ფავორიტი

    // slider items შექმნა
    swiperTrack.innerHTML = ""; // remove loader
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
