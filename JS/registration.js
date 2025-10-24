document.addEventListener("DOMContentLoaded", () => {
  // ===== Elements =====
  const login = document.getElementById("reg-login");
  const password = document.getElementById("reg-password");
  const confirmPassword = document.getElementById("reg-confirm-password");
  const city = document.getElementById("reg-city");
  const street = document.getElementById("reg-street");
  const house = document.getElementById("reg-house");
  const paymentCash = document.getElementById("reg-cash");
  const paymentCard = document.getElementById("reg-card");
  const registerBtn = document.getElementById("register-btn");
  const errorDiv = document.getElementById("register-error");

  // ===== City & Street Data =====
  const streetsByCity = {
    Tbilisi: ["Rustaveli Ave", "Chavchavadze Ave", "Agmashenebeli Ave"],
    Batumi: ["Rustaveli St", "Chavchavadze St", "Khimshiashvili St"],
    Kutaisi: ["Tsereteli St", "Chavchavadze St", "Gelati St"],
  };

  // ===== Validation =====
  function validateLogin(value) {
    return /^[A-Za-z][A-Za-z0-9]{2,}$/.test(value);
  }
  function validatePassword(value) {
    return /^(?=.{6,})(?=.*[!@#$%^&*(),.?":{}|<>]).*$/.test(value);
  }
  function validateConfirmPassword() {
    return confirmPassword.value && password.value === confirmPassword.value;
  }
  function validateCity() {
    return city.value !== "";
  }
  function validateStreet() {
    return street.value !== "";
  }
  function validateHouse(value) {
    return Number(value) > 1;
  }
  function validatePayment() {
    return paymentCash.checked || paymentCard.checked;
  }

  // ===== Utility (Validation visuals) =====
  function showInputError(input, message) {
    input.classList.add("invalid");
    input.style.border = "1.5px solid red";
    input.style.backgroundImage = "url('/assets/error-icon.svg')";
    input.style.backgroundRepeat = "no-repeat";
    input.style.backgroundPosition = "right 10px center";

    // individual error message under input
    let msg = input.parentElement.querySelector(".input-error");
    if (!msg) {
      msg = document.createElement("div");
      msg.className = "input-error";
      input.parentElement.appendChild(msg);
    }
    msg.textContent = message;
  }

  function clearInputError(input) {
    input.classList.remove("invalid");
    input.style.border = "";
    input.style.backgroundImage = "none";

    const msg = input.parentElement.querySelector(".input-error");
    if (msg) msg.remove();
  }

  // ===== Check overall form validity =====
  function checkFormValidity() {
    const isValid =
      validateLogin(login.value) &&
      validatePassword(password.value) &&
      validateConfirmPassword() &&
      validateCity() &&
      validateStreet() &&
      validateHouse(house.value) &&
      validatePayment();

    registerBtn.disabled = !isValid;
    registerBtn.style.opacity = isValid ? "1" : "0.5";
    registerBtn.style.cursor = isValid ? "pointer" : "not-allowed";
  }

  // ===== Update Street Options =====
  function updateStreetOptions() {
    const selectedCity = city.value;
    street.innerHTML = '<option value="">Select street</option>';
    if (streetsByCity[selectedCity]) {
      streetsByCity[selectedCity].forEach((streetName) => {
        const option = document.createElement("option");
        option.value = streetName;
        option.textContent = streetName;
        street.appendChild(option);
      });
    }
    checkFormValidity();
  }

  // ===== Event Listeners =====
  [login, password, confirmPassword, house].forEach((input) => {
    input.addEventListener("blur", () => {
      if (input === login && !validateLogin(login.value))
        showInputError(login, "Login must be at least 3 English letters");
      else if (input === password && !validatePassword(password.value))
        showInputError(
          password,
          "Password must be at least 6 characters and contain 1 special character"
        );
      else if (input === confirmPassword && !validateConfirmPassword())
        showInputError(confirmPassword, "Passwords do not match");
      else if (input === house && !validateHouse(house.value))
        showInputError(house, "House number must be greater than 1");
      else clearInputError(input);

      checkFormValidity();
    });

    input.addEventListener("focus", () => clearInputError(input));
    input.addEventListener("input", checkFormValidity);
  });

  city.addEventListener("change", () => {
    updateStreetOptions();
    clearInputError(city);
  });

  street.addEventListener("change", () => {
    clearInputError(street);
    checkFormValidity();
  });

  [paymentCash, paymentCard].forEach((input) => {
    input.addEventListener("change", () => {
      clearInputError(input);
      checkFormValidity();
    });
  });

  // ===== Initial state =====
  checkFormValidity();

  // ===== Registration =====
  registerBtn.addEventListener("click", async () => {
    const payload = {
      login: login.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      city: city.value,
      street: street.value,
      houseNumber: Number(house.value),
      paymentMethod: paymentCash.checked ? "Cash" : "Card",
    };

    // სწორად შენახვა localStorage-ში
    localStorage.setItem("user", JSON.stringify(payload));

    try {
      const res = await fetch(
        "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      window.location.href = "signin.html";
    } catch (err) {
      errorDiv.textContent = err.message;
    }
  });
});
