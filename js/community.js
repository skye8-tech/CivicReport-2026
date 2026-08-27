// dashboard links
const communityRole = new URLSearchParams(window.location.search).get("from");
const communityDashboard = ["admin", "authority", "user"].includes(
  communityRole,
)
  ? communityRole
  : "user";

const dashboardLink = document.getElementById("dashboardLink");
const myReportsLink = document.getElementById("myReportsLink");
const statisticsLink = document.getElementById("statisticsLink");
const publicFeedLink = document.getElementById("publicFeedLink");
const newReportLink = document.getElementById("newReportLink");

if (dashboardLink) dashboardLink.href = `../pages/${communityDashboard}.html`;
if (myReportsLink) myReportsLink.href = `../pages/${communityDashboard}.html`;
if (statisticsLink) statisticsLink.href = `../pages/${communityDashboard}.html`;
if (publicFeedLink)
  publicFeedLink.href = `../pages/community.html?from=${communityDashboard}`;
if (newReportLink)
  newReportLink.href = `../pages/report.html?from=${communityDashboard}`;

// variables
let allReports = [];
let filteredReports = [];
let visibleCount = 3;

// load reports
function loadReports() {
  const saved = localStorage.getItem("civicReports");

  console.log("Raw localStorage data:", saved); // check this in console

  if (saved) {
    try {
      allReports = JSON.parse(saved);
      if (!Array.isArray(allReports)) {
        allReports = [];
      }
    } catch (error) {
      console.log("Error parsing reports:", error);
      allReports = [];
    }
  } else {
    allReports = [];
  }

  console.log("Loaded reports:", allReports); // check this too

  filteredReports = [...allReports];
  renderFeed();
}

// status badge
function getStatusBadge(status) {
  if (status === "Resolved") {
    return `<span class="status-badge status-resolved">Resolved</span>`;
  }
  if (status === "Pending" || status === "Under Review") {
    return `<span class="status-badge status-pending">Pending</span>`;
  }
  if (status === "In Progress") {
    return `<span class="status-badge status-progress">In Progress</span>`;
  }
  return `<span class="status-badge status-reported">Reported</span>`;
}

// render feed
function renderFeed() {
  const grid = document.getElementById("feedGrid");

  if (!grid) {
    console.log("Error: #feedGrid not found in HTML");
    return;
  }

  grid.innerHTML = "";

  if (filteredReports.length === 0) {
    grid.innerHTML = `<div class="empty">No incidents found.</div>`;
    updateLoadMoreButton();
    return;
  }

  const reportsToShow = filteredReports.slice(0, visibleCount);

  reportsToShow.forEach(function (report) {
    const card = document.createElement("div");
    card.className = "card";

    let imageHTML = "";
    if (report.image) {
      imageHTML = `<img src="${report.image}" alt="Report image">`;
    } else {
      imageHTML = `<div class="no-image">📷 No Image</div>`;
    }

    card.innerHTML = `
      <div class="card-image">
        ${imageHTML}
        ${getStatusBadge(report.status)}
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="category-tag">${report.category || "General"}</span>
          <span class="time-ago">${report.date || "Recently"}</span>
        </div>
        <div class="card-title">${report.category || "Incident"}</div>
        <div class="card-desc">${report.description || "No description available."}</div>
        <div class="card-footer">
          <div class="tracking">📍 ${report.location || "Unknown"}</div>
          <button class="view-btn" onclick="viewDetails('${report.referenceId}')">
            View Details
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  updateLoadMoreButton();
}

// load more
function loadMore() {
  visibleCount += 3;
  renderFeed();
}

function updateLoadMoreButton() {
  const loadMoreButton = document.getElementById("loadMoreButton");
  if (!loadMoreButton) return;

  if (visibleCount < filteredReports.length) {
    loadMoreButton.style.display = "block";
  } else {
    loadMoreButton.style.display = "none";
  }
}

// search
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", function () {
    const search = this.value.toLowerCase();

    filteredReports = allReports.filter(function (report) {
      return (
        (report.category && report.category.toLowerCase().includes(search)) ||
        (report.description &&
          report.description.toLowerCase().includes(search)) ||
        (report.location && report.location.toLowerCase().includes(search)) ||
        (report.referenceId &&
          report.referenceId.toLowerCase().includes(search))
      );
    });

    visibleCount = 3;
    renderFeed();
  });
}

// filter buttons
const filterButtons = document.getElementById("filterButtons");
if (filterButtons) {
  filterButtons.addEventListener("click", function (e) {
    if (!e.target.classList.contains("filter-btn")) return;

    document.querySelectorAll(".filter-btn").forEach(function (button) {
      button.classList.remove("active");
    });

    e.target.classList.add("active");

    const filter = e.target.getAttribute("data-filter");

    if (filter === "all" || filter === "all-categories") {
      filteredReports = [...allReports];
    } else if (
      filter === "Pending" ||
      filter === "Resolved" ||
      filter === "In Progress"
    ) {
      filteredReports = allReports.filter(function (report) {
        return report.status === filter;
      });
    } else {
      filteredReports = allReports.filter(function (report) {
        return (
          report.category &&
          report.category.toLowerCase().includes(filter.toLowerCase())
        );
      });
    }

    visibleCount = 3;
    renderFeed();
  });
}

// view details
function viewDetails(id) {
  const report = allReports.find((r) => r.referenceId === id);
  if (!report) return;

  document.getElementById("modalId").textContent = report.referenceId || "-";
  document.getElementById("modalCategory").textContent = report.category || "-";
  document.getElementById("modalLocation").textContent =
    report.location || "Not specified";
  document.getElementById("modalStatus").textContent = report.status || "-";
  document.getElementById("modalDate").textContent = report.date || "-";
  document.getElementById("modalDescription").textContent =
    report.description || "No description";

  // Image
  const imageContainer = document.getElementById("modalImageContainer");
  const modalImage = document.getElementById("modalImage");

  if (report.image) {
    modalImage.src = report.image;
    imageContainer.classList.add("show");
  } else {
    imageContainer.classList.remove("show");
  }

  // Show modal
  document.getElementById("viewModal").classList.add("show");
}

function closeModal() {
  document.getElementById("viewModal").classList.remove("show");
}

// Close when clicking outside
document.getElementById("viewModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// start (wait for page to load)
document.addEventListener("DOMContentLoaded", function () {
  loadReports();
});
