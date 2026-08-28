// admin signup

const adminForm = document.getElementById("adminSignupForm");

adminForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("adminName").value.trim();
  const email = document.getElementById("adminEmail").value.trim();
  const adminId = document.getElementById("adminId").value.trim();
  const department = document.getElementById("adminDepartment").value.trim();
  const password = document.getElementById("adminPassword").value;
  const confirmPassword = document.getElementById("adminConfirmPassword").value;

  // check password
  if (password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  // check passwords
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // get existing admins
  let admins = [];

  try {
    admins = JSON.parse(localStorage.getItem("civicAdmins") || "[]");

    if (!Array.isArray(admins)) {
      admins = [];
    }
  } catch (error) {
    admins = [];
  }

  // check existing email
  const emailExists = admins.some(function (admin) {
    return admin.email.toLowerCase() === email.toLowerCase();
  });

  if (emailExists) {
    alert("An admin account with this email already exists.");
    return;
  }

  // create admin
  const admin = {
    name: name,
    email: email,
    adminId: adminId,
    department: department,
    password: password,
  };

  // save admin
  admins.push(admin);

  localStorage.setItem("civicAdmins", JSON.stringify(admins));

  alert("Admin account created successfully!");

  // go to admin login
  window.location.href = "../pages/admin.html";
});
