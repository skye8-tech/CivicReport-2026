const map = document.getElementById("map");
const keys = document.querySelectorAll(".key");
const rCoords = document.getElementById("r-coords");
const rHours = document.getElementById("r-hours");
const rPhone = document.getElementById("r-phone");
const dirLink = document.getElementById("directions");
const bigLink = document.getElementById("larger");

function show(btn) {
  const q = btn.dataset.query;
  keys.forEach((k) => k.setAttribute("aria-selected", String(k === btn)));
  map.src =
    "https://www.google.com/maps?q=" +
    encodeURIComponent(q) +
    "&z=15&output=embed";
  rCoords.textContent = btn.dataset.coords;
  rHours.textContent = btn.dataset.hours;
  rPhone.textContent = btn.dataset.phone;
  dirLink.href =
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(q);
  bigLink.href =
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
}

keys.forEach((btn) => btn.addEventListener("click", () => show(btn)));
show(document.querySelector('.key[aria-selected="true"]'));
