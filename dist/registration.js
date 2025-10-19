"use strict";
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
// Validation functions
function validateLogin(value) {
    return /^[A-Za-z][A-Za-z]{2,}$/.test(value);
}
function validatePassword(value) {
    return /^(?=.*[!@#$%^&*]).{6,}$/.test(value);
}
function validateConfirmPassword() {
    return (confirmPassword.value !== "" && password.value === confirmPassword.value);
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
// Enable or disable register button
function checkFormValidity() {
    const isValid = validateLogin(login.value) &&
        validatePassword(password.value) &&
        validateConfirmPassword() &&
        validateCity() &&
        validateStreet() &&
        validateHouse(house.value) &&
        validatePayment();
    registerBtn.disabled = !isValid;
}
// Show specific error messages
function showError() {
    if (!validateLogin(login.value)) {
        errorDiv.textContent =
            "Login must be at least 3 letters and start with a letter";
    }
    else if (!validatePassword(password.value)) {
        errorDiv.textContent =
            "Password must be at least 6 characters and include 1 special character";
    }
    else if (!validateConfirmPassword()) {
        errorDiv.textContent = "Passwords do not match";
    }
    else if (!validateCity()) {
        errorDiv.textContent = "Please select a city";
    }
    else if (!validateStreet()) {
        errorDiv.textContent = "Please select a street";
    }
    else if (!validateHouse(house.value)) {
        errorDiv.textContent = "House number must be greater than 1";
    }
    else if (!validatePayment()) {
        errorDiv.textContent = "Please select a payment method";
    }
    else {
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
        const res = await fetch("http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Registration failed");
        }
        // Success: redirect to Sign In
        window.location.href = "signin.html";
    }
    catch (err) {
        errorDiv.textContent = err.message;
    }
});
