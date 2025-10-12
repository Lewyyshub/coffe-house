const slides = document.querySelectorAll(".swiper-slide");
const prevBtn = document.querySelector(".swiper-btn.prev");
const nextBtn = document.querySelector(".swiper-btn.next");
let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

prevBtn.addEventListener("click", () => {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
});

nextBtn.addEventListener("click", () => {
  current = (current + 1) % slides.length;
  showSlide(current);
});

showSlide(current);
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const mobileMenu = document.querySelector(".mobile-menu");

  burger.addEventListener("click", () => {
    mobileMenu.style.display =
      mobileMenu.style.display === "flex" ? "none" : "flex";
  });

  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.style.display = "none";
    }
  });
});
