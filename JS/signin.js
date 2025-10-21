// const loginInput = document.getElementById("login");
// const passwordInput = document.getElementById("password");
// const signInBtn = document.getElementById("signin-btn");
// const errorDiv = document.getElementById("signin-error");

// // ===== Validation Rules =====
// function validateLogin(value) {
//   return /^[A-Za-z][A-Za-z0-9]{2,}$/.test(value);
// }
// function validatePassword(value) {
//   return /^(?=.{6,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/.test(value);
// }

// // ===== Utility =====
// function showInputError(input, message) {
//   input.classList.add("invalid");
//   errorDiv.textContent = message;
// }
// function clearInputError(input) {
//   input.classList.remove("invalid");
//   errorDiv.textContent = "";
// }
// function checkFormValidity() {
//   const valid =
//     validateLogin(loginInput.value) && validatePassword(passwordInput.value);
//   signInBtn.disabled = !valid;
// }

// // ===== Event Listeners =====
// loginInput.addEventListener("blur", () => {
//   if (!validateLogin(loginInput.value)) {
//     showInputError(
//       loginInput,
//       "Login must be at least 3 characters and start with a letter"
//     );
//   } else {
//     clearInputError(loginInput);
//   }
//   checkFormValidity();
// });

// passwordInput.addEventListener("blur", () => {
//   if (!validatePassword(passwordInput.value)) {
//     showInputError(
//       passwordInput,
//       "Password must be at least 6 characters and contain 1 special character"
//     );
//   } else {
//     clearInputError(passwordInput);
//   }
//   checkFormValidity();
// });

// [loginInput, passwordInput].forEach((input) =>
//   input.addEventListener("focus", () => {
//     clearInputError(input);
//   })
// );

// // ===== Authentication =====
// signInBtn.addEventListener("click", async () => {
//   try {
//     const res = await fetch(
//       "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/auth/login",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           login: loginInput.value,
//           password: passwordInput.value,
//         }),
//       }
//     );

//     if (!res.ok) throw new Error("Incorrect login or password");

//     const data = await res.json();
//     localStorage.setItem("user", JSON.stringify(data));
//     window.location.href = "menu.html";
//   } catch (err) {
//     errorDiv.textContent = "Incorrect login or password";
//   }
// });
const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");
const signInBtn = document.getElementById("signin-btn");
const errorDiv = document.getElementById("signin-error");

// ===== Validation Rules =====
function validateLogin(value) {
  return /^[A-Za-z]{3,}$/.test(value); // მინ. 3 სიმბოლო, მხოლოდ ასოები
}

function validatePassword(value) {
  return /^(?=.{6,})(?=.*[!@#$%^&*(),.?":{}|<>]).*$/.test(value); // მინ. 6 სიმბოლო, 1 სპეციალური
}

// ===== Utility =====
function showInputError(input, message) {
  input.classList.add("invalid");
  errorDiv.textContent = message;
}

function clearInputError(input) {
  input.classList.remove("invalid");
  errorDiv.textContent = "";
}

function checkFormValidity() {
  const valid =
    validateLogin(loginInput.value) && validatePassword(passwordInput.value);
  signInBtn.disabled = !valid;
}

// ===== Event Listeners =====
loginInput.addEventListener("blur", () => {
  if (!validateLogin(loginInput.value)) {
    showInputError(
      loginInput,
      "Login must be at least 3 English letters and start with a letter"
    );
  } else {
    clearInputError(loginInput);
  }
  checkFormValidity();
});

passwordInput.addEventListener("blur", () => {
  if (!validatePassword(passwordInput.value)) {
    showInputError(
      passwordInput,
      "Password must be at least 6 characters and contain 1 special character"
    );
  } else {
    clearInputError(passwordInput);
  }
  checkFormValidity();
});

[loginInput, passwordInput].forEach((input) =>
  input.addEventListener("focus", () => {
    clearInputError(input);
  })
);

// ===== Authentication =====
signInBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(
      "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/auth/login",
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
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "menu.html";
  } catch (err) {
    errorDiv.textContent = "Incorrect login or password";
  }
});
