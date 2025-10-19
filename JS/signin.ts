const loginInput = document.getElementById("login") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const signInBtn = document.getElementById("signin-btn") as HTMLButtonElement;
const errorDiv = document.getElementById("signin-error") as HTMLDivElement;

// Validation functions
function validateLogin(value: string): boolean {
  return /^[A-Za-z][A-Za-z]{2,}$/.test(value); // min 3 chars, start with letter, only letters
}

function validatePassword(value: string): boolean {
  return /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(value); // min 6 chars, 1 special
}

function checkFormValidity() {
  signInBtn.disabled = !(
    validateLogin(loginInput.value) && validatePassword(passwordInput.value)
  );
}

// Event listeners
loginInput.addEventListener("blur", () => {
  if (!validateLogin(loginInput.value)) {
    loginInput.classList.add("invalid");
    errorDiv.textContent =
      "Login must be at least 3 characters and start with a letter";
  }
});

loginInput.addEventListener("focus", () => {
  loginInput.classList.remove("invalid");
  errorDiv.textContent = "";
  checkFormValidity();
});

passwordInput.addEventListener("blur", () => {
  if (!validatePassword(passwordInput.value)) {
    passwordInput.classList.add("invalid");
    errorDiv.textContent =
      "Password must be at least 6 characters and contain 1 special character";
  }
});

passwordInput.addEventListener("focus", () => {
  passwordInput.classList.remove("invalid");
  errorDiv.textContent = "";
  checkFormValidity();
});

// Sign In button click
signInBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(
      "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: loginInput.value,
          password: passwordInput.value,
        }),
      }
    );

    if (!res.ok) throw new Error("Incorrect login or password");
    const data = await res.json();

    // Save token / user info if needed
    localStorage.setItem("user", JSON.stringify(data));

    // Redirect to Menu
    window.location.href = "menu.html";
  } catch (err) {
    errorDiv.textContent = "Incorrect login or password";
  }
});
