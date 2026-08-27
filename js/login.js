// 1. Show / Hide Password
const toggleBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

toggleBtn.addEventListener("click", function () {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

// Helper: Get all users from signup page
function getUsers() {
  const users = localStorage.getItem("civicReportUsers");
  return users ? JSON.parse(users) : [];
}

// Helper: Validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 2. Form Submit
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const emailInput = document
    .getElementById("email")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember").checked;

  // Clear previous error styles
  document.getElementById("email").classList.remove("border-red-500");
  document.getElementById("password").classList.remove("border-red-500");

  let isValid = true;

  // Validate Email
  if (emailInput === "") {
    alert("Please enter your email.");
    document.getElementById("email").classList.add("border-red-500");
    isValid = false;
  } else if (!isValidEmail(emailInput)) {
    alert("Please enter a valid email address.");
    document.getElementById("email").classList.add("border-red-500");
    isValid = false;
  }

  // Validate Password
  if (password === "") {
    alert("Please enter your password.");
    document.getElementById("password").classList.add("border-red-500");
    isValid = false;
  } else if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    document.getElementById("password").classList.add("border-red-500");
    isValid = false;
  }

  if (!isValid) return;

  // Check if user exists
  const users = getUsers();
  const user = users.find((u) => u.email === emailInput);

  if (!user) {
    alert("No account found with this email. Please create an account first.");
    // You can change this path if needed
    window.location.href = "../pages/signup.html";
    return;
  }

  // Check password
  if (user.password !== password) {
    alert("Incorrect password. Please try again.");
    document.getElementById("password").classList.add("border-red-500");
    return;
  }

  // successful login
  // 1. Save the logged-in user (this is what the Dashboard reads)
  const currentUser = {
    fullName: user.fullName,
    email: user.email,
  };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // 2. Optional: Save session info
  const sessionData = {
    fullName: user.fullName,
    email: user.email,
    loggedIn: true,
    remember: remember,
    loginTime: new Date().toISOString(),
  };

  if (remember) {
    localStorage.setItem("civicReportSession", JSON.stringify(sessionData));
  } else {
    sessionStorage.setItem("civicReportSession", JSON.stringify(sessionData));
  }

  // 3. Show success message
  alert("Welcome back, " + user.fullName + "!");

  // 4. Clear the form
  document.getElementById("loginForm").reset();

  // 5. Redirect to Dashboard
  window.location.href = "../pages/admin.html";
});
