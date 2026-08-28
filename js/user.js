// show user name
function showUserName() {
  const welcomeText = document.getElementById("welcomeText");
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (welcomeText && currentUser && currentUser.fullName) {
    welcomeText.textContent = "Welcome back, " + currentUser.fullName + ".";
  } else if (welcomeText) {
    welcomeText.textContent = "Welcome back, User.";
  }
}

//status badge
function getStatusBadge(status) {
  if (status === "Under Review" || status === "Pending") {
    return '<span class="badge under-review">Pending</span>';
  }
  if (status === "Reported") {
    return '<span class="badge reported">Reported</span>';
  }
  if (status === "Resolved") {
    return '<span class="badge resolved">Resolved</span>';
  }
  if (status === "In Progress") {
    return '<span class="badge in-progress">In Progress</span>';
  }
  return '<span class="badge reported">Reported</span>';
}

// update score circle
function updateImpactScore(resolved, total) {
  let percentage = 0;

  if (total > 0) {
    percentage = Math.round((resolved / total) * 100);
  }

  //circle number
  const circleText = document.querySelector(".circle");
  if (circleText) {
    circleText.textContent = percentage;
  }

  //  blue progress
  // full circle 213
  const offset = 213 - (213 * percentage) / 100;
  const progressCircle = document.querySelector(".progress-circle");

  if (progressCircle) {
    progressCircle.style.strokeDashoffset = offset;
  }
}

//load reports
function loadReports(showAll = false) {
  let reports = JSON.parse(localStorage.getItem("civicReports")) || [];

  const tableBody = document.getElementById("reportsTable");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  // Count totals
  document.getElementById("totalReports").textContent = reports.length;

  let openCount = 0;
  let resolvedCount = 0;

  reports.forEach(function (report) {
    if (report.status === "Resolved") {
      resolvedCount++;
    } else {
      openCount++;
    }
  });

  document.getElementById("openIncidents").textContent = openCount;
  document.getElementById("resolvedCount").textContent = resolvedCount;

  // blue percentage circle
  updateImpactScore(resolvedCount, reports.length);

  // decide how many reports to show
  let displayReports = reports.slice().reverse(); // newest first

  if (!showAll) {
    displayReports = displayReports.slice(0, 5); // show only 5 by default
  }

  if (displayReports.length === 0) {
    tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 30px; color:#9ca3af;">
            No reports yet. Submit your first report!
          </td>
        </tr>
      `;
    return;
  }

  displayReports.forEach(function (report) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td class="ref-id">${report.referenceId}</td>
        <td>${report.category}</td>
        <td>${report.date}</td>
        <td>${getStatusBadge(report.status)}</td>
        <td>
          <button class="view-btn" onclick="viewReport('${report.referenceId}')">
            View
          </button>
          <button class="view-btn" onclick="editReport('${report.referenceId}')">
            Edit
          </button>
        </td>
      `;

    tableBody.appendChild(row);
  });
}

function editReport(refId) {
  window.location.href =
    "../pages/report.html?edit=" + encodeURIComponent(refId);
}

//view single report
function viewReport(refId) {
  const reports = JSON.parse(localStorage.getItem("civicReports")) || [];
  const report = reports.find((r) => r.referenceId === refId);

  if (report) {
    alert(
      "📋 Report Details\n\n" +
        "Reference ID: " +
        report.referenceId +
        "\n" +
        "Category: " +
        report.category +
        "\n" +
        "Location: " +
        (report.location || "Not provided") +
        "\n" +
        "Urgency: " +
        (report.urgency || "Not set") +
        "\n" +
        "Status: " +
        report.status +
        "\n" +
        "Date: " +
        report.date +
        "\n\n" +
        "Description:\n" +
        (report.description || "No description"),
    );
  }
}

//view all btn
function viewAllReports() {
  loadReports(true);
}

// run when page loads
showUserName();
loadReports(false); // false = show only latest 5
