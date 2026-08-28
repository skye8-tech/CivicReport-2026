// navbar
const navbar = document.createElement("nav");
navbar.className = `
    w-full 
    min-h-[82px] 
    bg-white 
    border-t 
    border-b 
    border-gray-200 
    shadow-sm 
    flex 
    items-center 
    justify-between 
    px-[5%] 
    py-2 
    relative 
    z-50
    sticky
    top-0
`;

// logo
const logo = document.createElement("a");
logo.href = "../index.html";
logo.className = `
    text-[28px] 
    font-bold 
    text-[#1769aa] 
    whitespace-nowrap
`;
logo.textContent = "CivicReport";

// links container
const navLinks = document.createElement("div");
navLinks.id = "navLinks";
navLinks.className = `
    flex 
    items-center 
    gap-8 
    ml-10 
    max-[850px]:ml-0 
    max-[850px]:gap-6 
    max-[768px]:hidden 
    max-[768px]:flex-col 
    max-[768px]:absolute 
    max-[768px]:top-[82px] 
    max-[768px]:left-0 
    max-[768px]:w-full 
    max-[768px]:bg-white 
    max-[768px]:border-b 
    max-[768px]:border-gray-200 
    max-[768px]:shadow-md 
    max-[768px]:py-4 
    max-[768px]:gap-0 
    max-[768px]:z-40
`;

const links = [
  { text: "Public Feed", href: "../pages/publicfeed.html" },
  { text: "About", href: "../pages/about.html" },
  { text: "Contact", href: "../pages/contact.html" },
];

links.forEach((link) => {
  const a = document.createElement("a");

  a.href = link.href;
  a.textContent = link.text;

  a.className = `
        relative 
        py-7 
        text-[15px] 
        font-medium 
        text-gray-600 
        transition 
        duration-300 
        hover:text-[#1769aa] 
        max-[768px]:py-3 
        max-[768px]:w-full 
        max-[768px]:text-center 
        max-[768px]:border-b 
        max-[768px]:border-gray-100
    `;

  // active class
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const linkPage = link.href.split("/").pop().split("?")[0];

  if (currentPage === linkPage) {
    a.classList.add("active");

    a.classList.remove("text-gray-600");

    a.classList.add(
      "text-[#1769aa]",
      "after:content-['']",
      "after:absolute",
      "after:left-0",
      "after:bottom-4",
      "after:w-full",
      "after:h-[2px]",
      "after:bg-[#1769aa]",
    );
  }

  navLinks.appendChild(a);
});

// right side
const navRight = document.createElement("div");
navRight.className = `
    flex 
    items-center 
    gap-5 
    max-[550px]:gap-3
`;

// sign in
const signIn = document.createElement("a");
signIn.href = "../pages/login.html";
signIn.textContent = "Sign In";
signIn.className = `
    text-[15px] 
    font-medium 
    text-gray-700 
    no-underline 
    transition 
    duration-300 
    hover:text-[#1769aa] 
    max-[480px]:text-[13px]
`;

// report button
const reportButton = document.createElement("a");
reportButton.href = "../pages/report-new.html";
reportButton.className = `
    flex 
    items-center 
    gap-2 
    px-5 
    py-2.5 
    rounded 
    bg-[#1769aa] 
    text-white 
    text-sm 
    font-semibold 
    no-underline 
    shadow-md 
    shadow-blue-500/20 
    transition 
    duration-300 
    hover:bg-[#12578d] 
    hover:-translate-y-[1px] 
    max-[550px]:px-3 
    max-[550px]:py-2 
    max-[480px]:text-xs
`;

reportButton.innerHTML = `
    <span>♧</span>
    <span class="max-[400px]:hidden">Report Incident</span>
    <span class="hidden max-[400px]:inline">Report</span>
`;

// burger button
const burgerBtn = document.createElement("button");
burgerBtn.id = "burgerBtn";
burgerBtn.className = `
    hidden 
    max-[768px]:flex 
    items-center 
    justify-center 
    w-10 
    h-10 
    text-2xl 
    text-[#1769aa] 
    bg-transparent 
    border-none 
    cursor-pointer
`;
burgerBtn.textContent = "☰";

// append right items
navRight.appendChild(signIn);
navRight.appendChild(reportButton);
navRight.appendChild(burgerBtn);

// build navbar
navbar.appendChild(logo);
navbar.appendChild(navLinks);
navbar.appendChild(navRight);
document.body.prepend(navbar);

// burger toggle
burgerBtn.addEventListener("click", function () {
  if (navLinks.classList.contains("max-[768px]:hidden")) {
    navLinks.classList.remove("max-[768px]:hidden");

    navLinks.classList.add("max-[768px]:flex");

    burgerBtn.textContent = "✕";
  } else {
    navLinks.classList.add("max-[768px]:hidden");

    navLinks.classList.remove("max-[768px]:flex");

    burgerBtn.textContent = "☰";
  }
});
