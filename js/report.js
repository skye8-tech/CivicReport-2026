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

// ====================== EDIT MODE ======================
const editId = new URLSearchParams(window.location.search).get("edit");
let isEditMode = false;
let originalImage = null;

if (editId) {
  const reports = JSON.parse(localStorage.getItem("civicReports") || "[]");
  const reportToEdit = reports.find((r) => r.referenceId === editId);

  if (reportToEdit) {
    isEditMode = true;
    originalImage = reportToEdit.image || null;

    // Fill the form with existing data
    document.getElementById("reporterName").value =
      reportToEdit.reporterName || "";
    document.getElementById("reporterPhone").value =
      reportToEdit.reporterPhone || "";
    document.getElementById("category").value = reportToEdit.category || "";
    document.getElementById("urgency").value =
      reportToEdit.urgency || "Medium - Needs Attention";
    document.getElementById("location").value = reportToEdit.location || "";
    document.getElementById("description").value =
      reportToEdit.description || "";
    charCount.textContent = document.getElementById("description").value.length;

    // Change button text
    const submitBtn = document.querySelector(
      "#reportForm button[type='submit']",
    );
    if (submitBtn) {
      submitBtn.textContent = "Save Changes";
    }
  }
}

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

  // Save or Update report
  function saveReport(imageData) {
    let reports = [];
    try {
      reports = JSON.parse(localStorage.getItem("civicReports") || "[]");
      if (!Array.isArray(reports)) reports = [];
    } catch (error) {
      reports = [];
    }

    if (isEditMode && editId) {
      // ========== UPDATE EXISTING REPORT ==========
      reports = reports.map(function (report) {
        if (report.referenceId === editId) {
          return {
            ...report,
            reporterName: reporterName,
            reporterPhone: reporterPhone,
            category: category,
            urgency: urgency,
            location: location,
            description: descriptionValue,
            image: imageData !== null ? imageData : report.image, // keep old image if no new one
            date: report.date, // keep original date
          };
        }
        return report;
      });

      try {
        localStorage.setItem("civicReports", JSON.stringify(reports));
        alert("Report updated successfully!");
      } catch (error) {
        alert("Could not save changes. The image may be too large.");
        return;
      }
    } else {
      // ========== CREATE NEW REPORT ==========
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

      reports.push(report);

      try {
        localStorage.setItem("civicReports", JSON.stringify(reports));
        alert(
          "Report submitted successfully!\n\nYour Reference ID: " +
            report.referenceId,
        );
      } catch (error) {
        alert(
          "This report could not be saved. The selected image may be too large.",
        );
        return;
      }
    }

    // Clear form
    document.getElementById("reportForm").reset();
    charCount.textContent = "0";
    fileList.innerHTML = "";
  }

  // Handle image
  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      saveReport(event.target.result);
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    // If editing and no new image selected, keep the old one
    saveReport(isEditMode ? originalImage : null);
  }
});
