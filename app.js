const toggleBtn = document.querySelector("#navbarToggleBtn");
const navbar = document.querySelector("#mob-navbar");

// Toggle navbar open/close
toggleBtn.addEventListener("click", () => {
  const isHidden = navbar.classList.contains("hidden");

  if (isHidden) {
    navbar.classList.remove("hidden");
    // Wait for display to kick in, then animate
    requestAnimationFrame(() => {
      navbar.classList.remove("opacity-0", "scale-95");
      navbar.classList.add("opacity-100", "scale-100");
    });
  } else {
    navbar.classList.remove("opacity-100", "scale-100");
    navbar.classList.add("opacity-0", "scale-95");

    setTimeout(() => {
      navbar.classList.add("hidden");
    }, 300); // Match Tailwind duration
  }
});

// Close when clicking outside
document.addEventListener("click", (event) => {
  const isClickInside =
    navbar.contains(event.target) || toggleBtn.contains(event.target);

  if (!isClickInside && !navbar.classList.contains("hidden")) {
    navbar.classList.remove("opacity-100", "scale-100");
    navbar.classList.add("opacity-0", "scale-95");
    setTimeout(() => {
      navbar.classList.add("hidden");
    }, 300);
  }
});
