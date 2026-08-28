document
  .getElementById("authorityForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // stop page from refreshing

    // Get all values
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const organization = document.getElementById("organization").value.trim();
    const role = document.getElementById("role").value;
    const badgeId = document.getElementById("badgeId").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    // validation
//  Check required fields
    if (
      !fullName ||
      !email ||
      !organization ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    // Simple email check
    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email address!");
      return;
    }

    // Password length
    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    // Passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    //  must be checked
    if (!terms) {
      alert("You must agree to the Terms of Service!");
      return;
    }

    // Create authority object
    const authority = {
      fullName: fullName,
      email: email,
      organization: organization,
      role: role,
      badgeId: badgeId,
      password: password,
      dateJoined: new Date().toLocaleString(),
    };

    // get existing authorities
    let authorities = JSON.parse(localStorage.getItem("authorityUsers")) || [];

    // if email exists
    const emailExists = authorities.some(function (user) {
      return user.email === email;
    });

    if (emailExists) {
      alert("This email is already registered!");
      return;
    }

    // Add new authority
    authorities.push(authority);

    localStorage.setItem("authorityUsers", JSON.stringify(authorities));

    // Success message
    alert("Authority account created successfully!\n\nYou can now log in.");

    // Clear the form
    document.getElementById("authorityForm").reset();
    window.location.href = "../pages/authority.html";
  });
