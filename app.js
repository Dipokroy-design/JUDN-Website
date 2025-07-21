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

// profile modal - line 157-227
// Profile Modal JS

function showProfileModal() {
  const modal = document.getElementById("profileModal");
  modal.classList.remove("hidden");
  modal.style.transform = "translateX(0)";
}

function hideProfileModal(event) {
  const modal = document.getElementById("profileModal");
  if (!event || event.target === modal) {
    modal.style.transform = "translateX(100%)";
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300); // match transition duration
  }
}

// image to product card page -
// filepath: /Users/masud/Desktop/JUDN-Website/index.html
function openProductCard(productId, imageUrl) {
  localStorage.setItem("selectedProductId", productId);
  localStorage.setItem("selectedGalleryImage", imageUrl); // Optional, for fallback
  window.location.href = "productCard.html";
}

// this is a alart message logic
function showAlart(message) {
  document.getElementById("alertMessage").textContent = message;
  document.getElementById("customAlert").classList.remove("hidden");
}
function closeCustomAlert() {
  document.getElementById("customAlert").classList.add("hidden");
}
