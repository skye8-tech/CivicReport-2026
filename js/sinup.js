// Password strength
function checkPasswordStrength() {
  const password = document.getElementById("password").value;
  const bar = document.getElementById("strengthBar");
  const text = document.getElementById("strengthText");

  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  // update bar
  if (password.length > 0 && password.length < 8) {
    bar.style.width = "10%";
    bar.className = "h-full bg-red-800 transition-all duration-300";
    text.textContent = "Too Short";
    text.className = "text-xs text-red-800 font-medium";
  } else if (strength <= 2) {
    bar.style.width = "25%";
    bar.className = "h-full bg-red-400 transition-all duration-300";
    text.textContent = "Weak";
    text.className = "text-xs text-red-500 font-medium";
  } else if (strength <= 3) {
    bar.style.width = "60%";
    bar.className = "h-full bg-yellow-400 transition-all duration-300";
    text.textContent = "Medium";
    text.className = "text-xs text-yellow-600 font-medium";
  } else {
    bar.style.width = "100%";
    bar.className = "h-full bg-green-500 transition-all duration-300";
    text.textContent = "Strong";
    text.className = "text-xs text-green-600 font-medium";
  }
}

// get uers
function getUsers() {
  const users = localStorage.getItem("civicReportUsers");
  return users ? JSON.parse(users) : [];
}

// save users
function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("civicReportUsers", JSON.stringify(users));
}

// submit
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms").checked;

  // length
  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  // verify pass
  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  // agree
  if (!terms) {
    alert("You must agree to the Terms of Service and Privacy Policy.");
    return;
  }

  // Check if email already exists
  const users = getUsers();
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    alert("An account with this email already exists.");
    return;
  }

  // Create user object and save to localStorage
  const newUser = {
    id: Date.now(),
    fullName,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem("authorityUsers", JSON.stringify(signup));

  saveUser(newUser);

  alert("Account created successfully!");
  // reset
  document.getElementById("signupForm").reset();
  /*strengthbar*/
  document.getElementById("strengthBar").style.width = "25%";
  document.getElementById("strengthBar").className =
    "h-full bg-red-400 transition-all duration-300";
  document.getElementById("strengthText").textContent = "Weak";
  document.getElementById("strengthText").className =
    "text-xs text-red-500 font-medium";
  window.location.href = "/pages/admin.html";
});
