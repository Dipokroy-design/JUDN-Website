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

function showPointBar() {
  document.getElementById("pointsModal").classList.remove("hidden");
}

function hidePointBar(event) {
  // If event is passed from overlay click or close button
  document.getElementById("pointsModal").classList.add("hidden");
}

function showProfileModal() {
  document.getElementById("profileModal").classList.remove("hidden");
}

function hideProfileModal(event) {
  document.getElementById("profileModal").classList.add("hidden");
}
// this is a animation code for scrolling
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".autoShow");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  elements.forEach((el) => observer.observe(el));
});

// Blur scrolling animation
const blurElements = document.querySelectorAll(".autoBlue");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("inView");
        // Uncomment to blur again when out of view
        // observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.3,
  }
);

blurElements.forEach((el) => observer.observe(el));
