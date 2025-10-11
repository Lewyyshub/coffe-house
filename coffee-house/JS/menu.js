fetch("../products.json")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("products-container");
    const filterButtons = document.querySelectorAll(".filter div");

    const displayProducts = (items) => {
      container.innerHTML = "";
      items.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("products");

        card.innerHTML = `
          <div class="image-div">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="stats">
            <p>${item.name}</p>
            <span>${item.description}</span>
            <span class="price">$${item.price}</span>
          </div>
        `;
        container.appendChild(card);
      });
    };

    displayProducts(data.filter((item) => item.category === "coffee"));
    filterButtons[0].classList.add("active");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        
        const text = btn.textContent.trim().toLowerCase();
        let category = "";

        if (text.includes("coffe")) category = "coffee";
        else if (text.includes("tea")) category = "tea";
        else if (text.includes("dessert")) category = "dessert";

       
        const filtered = data.filter((item) => item.category === category);
        displayProducts(filtered);
      });
    });
  })
  .catch((err) => console.error("Error loading JSON:", err));
