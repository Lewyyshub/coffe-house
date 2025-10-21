
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
    Tbilisi: [
      "Rustaveli Ave",
      "Chavchavadze Ave",
      "Agmashenebeli Ave",
      "Vake Park St",
      "Saburtalo St",
      "Didube St",
      "Gldani St",
      "Vazha-Pshavela St",
      "Vera St",
      "Avlabari St",
    ],
    Batumi: [
      "Rustaveli St",
      "Chavchavadze St",
      "Khimshiashvili St",
      "Gorgiladze St",
      "Pirosmani St",
      "Tbel Abuseridze St",
      "Zubalashvili St",
      "Pushkin St",
      "Melikishvili St",
      "Tamar Mepe St",
    ],
    Kutaisi: [
      "Tsereteli St",
      "Chavchavadze St",
      "Gelati St",
      "Rustaveli St",
      "David Agmashenebeli St",
      "Tamar Mepe St",
      "Nikea St",
      "Paliashvili St",
      "Poti St",
      "Khachapuridze St",
    ],
  };

  // ===== Validation =====
  function validateLogin(value) {
    return /^[A-Za-z]{3,}$/.test(value);
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

  // ===== Utility =====
  function showErrorMessage(input, message) {
    input.classList.add("invalid");
    errorDiv.textContent = message;
  }

  function clearError(input) {
    input.classList.remove("invalid");
    errorDiv.textContent = "";
  }

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
        showErrorMessage(login, "Login must be at least 3 English letters");
      else if (input === password && !validatePassword(password.value))
        showErrorMessage(
          password,
          "Password must be at least 6 characters and contain 1 special character"
        );
      else if (input === confirmPassword && !validateConfirmPassword())
        showErrorMessage(confirmPassword, "Passwords do not match");
      else if (input === house && !validateHouse(house.value))
        showErrorMessage(house, "House number must be greater than 1");
      else clearError(input);

      checkFormValidity();
    });
    input.addEventListener("focus", () => clearError(input));
  });

  city.addEventListener("change", () => {
    updateStreetOptions();
    clearError(city);
  });

  street.addEventListener("change", () => {
    clearError(street);
    checkFormValidity();
  });

  [paymentCash, paymentCard].forEach((input) => {
    input.addEventListener("change", () => {
      clearError(input);
      checkFormValidity();
    });
  });

  // ===== Registration =====
  registerBtn.addEventListener("click", async () => {
    const payload = {
      login: login.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      city: city.value,
      street: street.value,
      houseNumber: Number(house.value),
      paymentMethod: paymentCash.checked ? "cash" : "card",
    };

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
