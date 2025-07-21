const products = [
  {
    id: 1,
    name: "Series-A Shirt",
    price: "৳800.00",
    tag: "New",
    description: "Premium cotton, bold style.",
    image:
      "https://i.pinimg.com/736x/fc/a4/41/fca4412b3e955ab04a1b159df422b9dc.jpg", // Placeholder image URL
  },
  {
    id: 2,
    name: "Series-B Hoodie",
    price: "৳1200.00",
    tag: "Best Seller",
    description: "Warm, comfy, standout.",
    image:
      "https://i.pinimg.com/736x/46/f9/8f/46f98ff91157e6d7df349e4b2bdd969a.jpg",
  },
  {
    id: 3,
    name: "Series-C Pants",
    price: "৳950.00",
    tag: "Popular",
    description: "Modern fit, durable fabric.",
    image:
      "https://i.pinimg.com/1200x/3d/1f/05/3d1f056abe9f8fa2c63842dc4446c654.jpg",
  },
  {
    id: 4,
    name: "Series-D Jacket",
    price: "৳1800.00",
    tag: "Limited",
    description: "Statement piece, all-weather.",
    image:
      "https://i.pinimg.com/1200x/3c/9c/38/3c9c3832fc41df8e6a42155a29be4070.jpg",
  },
  {
    id: 5,
    name: "Series-D Jacket",
    price: "৳1800.00",
    tag: "Limited",
    description: "Statement piece, all-weather.",
    image:
      "https://i.pinimg.com/736x/57/5c/23/575c2341b0db171e2524a73e504bd7fe.jpg",
  },
];

const productId = localStorage.getItem("selectedProductId");
const product = products.find((p) => p.id == productId);

if (product) {
  document.getElementById("productImage").src = product.image;
  document.getElementById("productImage").alt = product.name;
  document.getElementById("productTag").textContent = product.tag;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = product.price;
  document.getElementById("productDesc").textContent = product.description;
  // Render related products (simple example)
  const related = products.filter((p) => p.id != product.id).slice(0, 4);
  document.getElementById("relatedProducts").innerHTML = related
    .map(
      (r) => `
    <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer" onclick="localStorage.setItem('selectedProductId', ${r.id}); window.location.href='productCard.html'">
      <img src="${r.image}" alt="${r.name}" class="w-full h-[250px] object-cover rounded-t-2xl"/>
      <div class="p-4">
        <span class="bg-[#fa2d37] text-white text-xs font-bold px-2 py-1 rounded-full">${r.tag}</span>
        <h4 class="mt-2 text-base font-bold text-gray-900">${r.name}</h4>
        <span class="text-[#fa2d37] font-bold">${r.price}</span>
      </div>
    </div>
  `
    )
    .join("");
  localStorage.removeItem("selectedGalleryImage"); // Clean up
} else if (localStorage.getItem("selectedGalleryImage")) {
  // Fallback for gallery-only images
  const galleryImage = localStorage.getItem("selectedGalleryImage");
  document.getElementById("productImage").src = galleryImage;
  document.getElementById("productImage").alt = "Gallery Product";
  document.getElementById("productTag").textContent = "Gallery";
  document.getElementById("productName").textContent = "JUDN Product";
  document.getElementById("productPrice").textContent = "৳---";
  document.getElementById("productDesc").textContent =
    "No details available for this product. Please contact us for more information.";
  localStorage.removeItem("selectedGalleryImage");
}

// this is a alart message logic
function showAlart(message) {
  document.getElementById("alertMessage").textContent = message;
  document.getElementById("customAlert").classList.remove("hidden");
}
function closeCustomAlert() {
  document.getElementById("customAlert").classList.add("hidden");
}
