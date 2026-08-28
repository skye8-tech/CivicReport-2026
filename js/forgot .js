// Helpers
function getUsers() {
  const users = localStorage.getItem("civicReportUsers");
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem("civicReportUsers", JSON.stringify(users));
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

let currentUserEmail = "";

// 1: check if email exists
document.getElementById("checkEmailBtn").addEventListener("click", function () {
  const emailInput = document.getElementById("resetEmail");
  const email = emailInput.value.trim().toLowerCase();
  emailInput.classList.remove("border-red-500");

  if (email === "") {
    alert("Please enter your email.");
    emailInput.classList.add("border-red-500");
    return;
  }
  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    emailInput.classList.add("border-red-500");
    return;
  }

  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    alert("No account found with this email. Please create an account first.");
    window.location.href = "../pages/admin-signup.html";
    return;
  }

  // Email found - show step 2
  currentUserEmail = email;
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
});

// step2: reset password
document.getElementById("forgotForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmNewPassword").value;

  // Clear error styles
  document.getElementById("newPassword").classList.remove("border-red-500");
  document
    .getElementById("confirmNewPassword")
    .classList.remove("border-red-500");

  let isValid = true;

  // password length >= 8
  if (newPassword.length < 8) {
    alert("Password must be at least 8 characters long.");
    document.getElementById("newPassword").classList.add("border-red-500");
    isValid = false;
  }

  // passwords match
  if (newPassword !== confirmPassword) {
    alert("Passwords do not match!");
    document
      .getElementById("confirmNewPassword")
      .classList.add("border-red-500");
    isValid = false;
  }

  if (!isValid) return;

  // update password in localStorage
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.email === currentUserEmail);

  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    users[userIndex].updatedAt = new Date().toISOString();
    saveUsers(users);

    alert(
      "Password reset successfully! You can now log in with your new password.",
    );

    // Clear form and redirect
    document.getElementById("forgotForm").reset();
    window.location.href = "../pages/admin-login.html";
  } else {
    alert("Error: User not found. Please try again.");
  }
});
