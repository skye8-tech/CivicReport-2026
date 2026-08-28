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
`;

// logo
const logo = document.createElement("a");
logo.href = "index.html";
logo.className = `
    text-[28px]
    font-bold
    text-[#1769aa]
    whitespace-nowrap
`;
logo.textContent = "CivicReport Platform";

// links
const navLinks = document.createElement("div");
navLinks.className = `
    flex
    items-center
    gap-8
    ml-10
    max-[850px]:ml-0
    max-[850px]:gap-6
    max-[550px]:gap-4
`;

const links = [
  {
    text: "Public Feed",
    href: "../pages/community.html",
  },
  {
    text: "About",
    href: "#",
  },

  {
    text: "Contact",
    href: "../pages/report.html",
  },
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
    `;

  // Check active page
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  if (currentPage === link.href) {
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

// rigth
const navRight = document.createElement("div");
navRight.className = `
    flex
    items-center
    gap-5
    max-[550px]:gap-3
`;

// sbtn
const signIn = document.createElement("a");
signIn.href = "../pages/signup.html";
signIn.textContent = "Sign In";
signIn.className = `
    text-[15px]
    font-medium
    text-gray-700
    no-underline
    transition
    duration-300
    hover:text-[#1769aa]
`;

// incident btn
const reportButton = document.createElement("a");
reportButton.href = "../pages/report.html";
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
`;

reportButton.innerHTML = `
    <span>♧</span>
    <span>Report Incident</span>
`;

// append nav
navRight.appendChild(signIn);
navRight.appendChild(reportButton);

navbar.appendChild(logo);
navbar.appendChild(navLinks);
navbar.appendChild(navRight);

document.body.prepend(navbar);
