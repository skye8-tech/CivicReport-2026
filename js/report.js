// ====================== CHARACTER COUNTER ======================
const description = document.getElementById("description");
const charCount = document.getElementById("charCount");

description.addEventListener("input", function () {
  charCount.textContent = this.value.length;
});

// ====================== SHOW SELECTED FILES ======================
const photosInput = document.getElementById("photos");
const fileList = document.getElementById("fileList");

photosInput.addEventListener("change", function () {
  fileList.innerHTML = "";
  const files = Array.from(this.files).slice(0, 3);

  files.forEach(function (file) {
    const p = document.createElement("p");
    p.textContent = "📷 " + file.name;
    fileList.appendChild(p);
  });
});

// ====================== USE CURRENT LOCATION ======================
document
  .getElementById("useLocationBtn")
  .addEventListener("click", function () {
    const locationInput = document.getElementById("location");
    const btn = document.getElementById("useLocationBtn");

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    btn.textContent = "Detecting...";
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);

        locationInput.value = `Lat: ${lat}, Lng: ${lng}`;

        btn.textContent = "Use Current Location";
        btn.disabled = false;
        alert("Location detected successfully!");
      },
      function (error) {
        btn.textContent = "Use Current Location";
        btn.disabled = false;

        if (error.code === error.PERMISSION_DENIED) {
          alert("Location access denied. Please allow location permission.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert("Location information is unavailable.");
        } else if (error.code === error.TIMEOUT) {
          alert("Location request timed out.");
        } else {
          alert("An unknown error occurred while getting location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });

// ====================== FORM SUBMIT ======================
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const reporterName = document.getElementById("reporterName").value.trim();
  const reporterPhone = document.getElementById("reporterPhone").value.trim();
  const category = document.getElementById("category").value;
  const urgency = document.getElementById("urgency").value;
  const location = document.getElementById("location").value.trim();
  const descriptionValue = document.getElementById("description").value.trim();
  const photoInput = document.getElementById("photos");

  // Validation
  if (
    !reporterName ||
    !reporterPhone ||
    !category ||
    !location ||
    !descriptionValue
  ) {
    alert(
      "Please fill in all required fields (Name, Phone, Category, Location and Description)!",
    );
    return;
  }

  if (reporterPhone.length < 10) {
    alert("Please enter a valid telephone number!");
    return;
  }

  // Save report
  function saveReport(imageData) {
    const report = {
      referenceId: "CR-" + Date.now().toString().slice(-6),
      reporterName: reporterName,
      reporterPhone: reporterPhone,
      category: category,
      urgency: urgency,
      location: location,
      description: descriptionValue,
      status: "Reported",
      date: new Date().toLocaleString(),
      image: imageData || null,
    };

    let reports = [];
    try {
      reports = JSON.parse(localStorage.getItem("civicReports") || "[]");
      if (!Array.isArray(reports)) reports = [];
    } catch (error) {
      reports = [];
    }

    reports.push(report);

    try {
      localStorage.setItem("civicReports", JSON.stringify(reports));
    } catch (error) {
      alert(
        "This report could not be saved permanently. The selected image may be too large for browser storage.",
      );
      return;
    }

    alert(
      "Report submitted successfully!\n\nYour Reference ID: " +
        report.referenceId,
    );

    // Clear form
    document.getElementById("reportForm").reset();
    charCount.textContent = "0";
    fileList.innerHTML = "";
  }

  // Handle image upload
  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      saveReport(event.target.result);
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    saveReport(null);
  }
});
