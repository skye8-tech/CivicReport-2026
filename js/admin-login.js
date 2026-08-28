// admin login
const adminLoginForm = document.getElementById("adminLoginForm");

adminLoginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  // get admin accounts
  let admins = [];

  try {
    admins = JSON.parse(localStorage.getItem("civicAdmins") || "[]");

    if (!Array.isArray(admins)) {
      admins = [];
    }
  } catch (error) {
    admins = [];
  }

  // default admin account
  if (admins.length === 0) {
    admins.push({
      name: "System Administrator",
      email: "admin@civicreport.com",
      password: "admin123",
      role: "admin",
    });
  }

  // find admin
  const admin = admins.find(function (account) {
    return account.email === email && account.password === password;
  });

  if (!admin) {
    alert("Invalid admin email or password.");

    return;
  }

  // save logged in admin
  localStorage.setItem(
    "loggedInAdmin",
    JSON.stringify({
      name: admin.name,
      email: admin.email,
      role: "admin",
    }),
  );

  alert("Login successful!");

  // go to admin dashboard
  window.location.href = "../pages/admin.html";
});
