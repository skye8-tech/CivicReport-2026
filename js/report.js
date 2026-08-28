// char count
const description = document.getElementById("description");
const charCount = document.getElementById("charCount");

description.addEventListener("input", function () {
  charCount.textContent = this.value.length;
});

// show selected file
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

// current location
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
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // convert coordinates into actual location
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        )
          .then(function (response) {
            return response.json();
          })

          .then(function (data) {
            if (data && data.address) {
              const address = data.address;

              // get readable location
              const locationParts = [];

              if (address.road) {
                locationParts.push(address.road);
              }

              if (address.suburb) {
                locationParts.push(address.suburb);
              }

              if (address.city) {
                locationParts.push(address.city);
              } else if (address.town) {
                locationParts.push(address.town);
              } else if (address.village) {
                locationParts.push(address.village);
              }

              if (address.state) {
                locationParts.push(address.state);
              }

              if (address.country) {
                locationParts.push(address.country);
              }

              locationInput.value = locationParts.join(", ");

              alert("Location detected successfully!");
            } else {
              locationInput.value = "Location could not be identified.";

              alert("Could not identify your location.");
            }

            btn.textContent = "Use Current Location";
            btn.disabled = false;
          })

          .catch(function (error) {
            console.log("Location error:", error);

            locationInput.value = "";

            btn.textContent = "Use Current Location";
            btn.disabled = false;

            alert("Could not get your actual location name.");
          });
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

// edit
const editId = new URLSearchParams(window.location.search).get("edit");

let isEditMode = false;

let originalImage = null;

if (editId) {
  const reports = JSON.parse(localStorage.getItem("civicReports") || "[]");

  const reportToEdit = reports.find(function (r) {
    return r.referenceId === editId;
  });

  if (reportToEdit) {
    isEditMode = true;

    originalImage = reportToEdit.image || null;

    // fill the form with existing data
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

    // change button text
    const submitBtn = document.querySelector(
      "#reportForm button[type='submit']",
    );

    if (submitBtn) {
      submitBtn.textContent = "Save Changes";
    }
  }
}

// submit form
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const reporterName = document.getElementById("reporterName").value.trim();

  const reporterPhone = document.getElementById("reporterPhone").value.trim();

  const category = document.getElementById("category").value;

  const urgency = document.getElementById("urgency").value;

  const location = document.getElementById("location").value.trim();

  const descriptionValue = document.getElementById("description").value.trim();

  const photoInput = document.getElementById("photos");

  // validation
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

  // save or update report
  function saveReport(imageData) {
    let reports = [];

    try {
      reports = JSON.parse(localStorage.getItem("civicReports") || "[]");

      if (!Array.isArray(reports)) {
        reports = [];
      }
    } catch (error) {
      reports = [];
    }

    if (isEditMode && editId) {
      // update existing report
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

            image: imageData !== null ? imageData : report.image,

            date: report.date,
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
      // create new report
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

    // clear form
    document.getElementById("reportForm").reset();

    charCount.textContent = "0";

    fileList.innerHTML = "";
  }

  // handle image
  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (event) {
      saveReport(event.target.result);
    };

    reader.readAsDataURL(photoInput.files[0]);
  } else {
    // keep old image when editing
    saveReport(isEditMode ? originalImage : null);
  }
});
