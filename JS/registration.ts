const login = document.getElementById("reg-login") as HTMLInputElement;
const password = document.getElementById("reg-password") as HTMLInputElement;
const confirmPassword = document.getElementById(
  "reg-confirm-password"
) as HTMLInputElement;
const city = document.getElementById("reg-city") as HTMLSelectElement;
const street = document.getElementById("reg-street") as HTMLSelectElement;
const house = document.getElementById("reg-house") as HTMLInputElement;
const paymentCash = document.getElementById("reg-cash") as HTMLInputElement;
const paymentCard = document.getElementById("reg-card") as HTMLInputElement;
const registerBtn = document.getElementById(
  "register-btn"
) as HTMLButtonElement;
const errorDiv = document.getElementById("register-error") as HTMLDivElement;

// Validation functions
function validateLogin(value: string): boolean {
  return /^[A-Za-z][A-Za-z]{2,}$/.test(value);
}

function validatePassword(value: string): boolean {
  return /^(?=.*[!@#$%^&*]).{6,}$/.test(value);
}

function validateConfirmPassword(): boolean {
  return (
    confirmPassword.value !== "" && password.value === confirmPassword.value
  );
}

function validateCity(): boolean {
  return city.value !== "";
}

function validateStreet(): boolean {
  return street.value !== "";
}

function validateHouse(value: string): boolean {
  return Number(value) > 1;
}

function validatePayment(): boolean {
  return paymentCash.checked || paymentCard.checked;
}

// Enable or disable register button
function checkFormValidity(): void {
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

// Show specific error messages
function showError(): void {
  if (!validateLogin(login.value)) {
    errorDiv.textContent =
      "Login must be at least 3 letters and start with a letter";
  } else if (!validatePassword(password.value)) {
    errorDiv.textContent =
      "Password must be at least 6 characters and include 1 special character";
  } else if (!validateConfirmPassword()) {
    errorDiv.textContent = "Passwords do not match";
  } else if (!validateCity()) {
    errorDiv.textContent = "Please select a city";
  } else if (!validateStreet()) {
    errorDiv.textContent = "Please select a street";
  } else if (!validateHouse(house.value)) {
    errorDiv.textContent = "House number must be greater than 1";
  } else if (!validatePayment()) {
    errorDiv.textContent = "Please select a payment method";
  } else {
    errorDiv.textContent = "";
  }
}

// Event listeners for validation
[login, password, confirmPassword, house].forEach((input) => {
  input.addEventListener("blur", () => {
    showError();
    checkFormValidity();
  });
  input.addEventListener("input", () => {
    showError();
    checkFormValidity();
  });
});

[city, street, paymentCash, paymentCard].forEach((input) => {
  input.addEventListener("change", () => {
    showError();
    checkFormValidity();
  });
});

// Initial check
document.addEventListener("DOMContentLoaded", () => {
  checkFormValidity();
});

// Registration API request
registerBtn.addEventListener("click", async () => {
  const payload = {
    login: login.value,
    password: password.value,
    city: city.value,
    street: street.value,
    houseNumber: Number(house.value),
    paymentMethod: paymentCash.checked ? "cash" : "card",
  };

  try {
    const res = await fetch(
      "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Registration failed");
    }

    // Success: redirect to Sign In
    window.location.href = "signin.html";
  } catch (err: any) {
    errorDiv.textContent = err.message;
  }
});
