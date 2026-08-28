const burgerBtn = document.getElementById("burgerBtn");
const sidebar = document.querySelector(".sidebar");

burgerBtn.addEventListener("click", function () {
  sidebar.classList.toggle("open");
});

// close sider when u click link
document.querySelectorAll(".sidebar a").forEach(function (link) {
  link.addEventListener("click", function () {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("open");
    }
  });
});
