const products = [
  {
    id: 1,
    name: "Zara",
    price: "৳799.00",
    tag: "New",
    description: "Premium cotton, bold style.",
    image:
      "https://i.pinimg.com/736x/fc/a4/41/fca4412b3e955ab04a1b159df422b9dc.jpg", // Placeholder image URL
  },
  {
    id: 2,
    name: "BHPC",
    price: "৳1200.00",
    tag: "Best Seller",
    description: "Warm, comfy, standout.",
    image:
      "https://i.pinimg.com/736x/46/f9/8f/46f98ff91157e6d7df349e4b2bdd969a.jpg",
  },
  {
    id: 3,
    name: "H&M",
    price: "৳949.00",
    tag: "Popular",
    description: "Modern fit, durable fabric.",
    image:
      "https://i.pinimg.com/1200x/3d/1f/05/3d1f056abe9f8fa2c63842dc4446c654.jpg",
  },
  {
    id: 4,
    name: "H&M",
    price: "৳799.00",
    tag: "Limited",
    description: "Statement piece, all-weather.",
    image:
      "https://i.pinimg.com/1200x/3c/9c/38/3c9c3832fc41df8e6a42155a29be4070.jpg",
  },
  {
    id: 5,
    name: "Zara",
    price: "৳800.00",
    tag: "Limited",
    description: "Premium cotton, bold style.",
    image:
      "https://i.pinimg.com/736x/57/5c/23/575c2341b0db171e2524a73e504bd7fe.jpg",
  },
  {
    id: 6,
    name: "Zara",
    price: "৳800.00",
    tag: "New",
    description: "Statement piece, all-weather.",
    image:
      "https://i.pinimg.com/736x/3b/e3/c9/3be3c9405e053752be15c00a6d96c454.jpg",
  },
  {
    id: 7,
    name: "Eton",
    price: "৳999.00",
    tag: "Limited",
    description: "Premium cotton, bold style.",
    image:
      "https://i.pinimg.com/736x/41/b7/c3/41b7c3eec3525ba7b2191f42094ca8f1.jpg",
  },
  {
    id: 8,
    name: "BHPC",
    price: "৳799.00",
    tag: "New",
    description: "Premium cotton, bold style.",
    image:
      "https://i.pinimg.com/736x/85/45/1c/85451c62cb3d224d99bbead6641606e1.jpg",
  },
  {
    id: 9,
    name: "BHPC",
    price: "৳800.00",
    tag: "Popular",
    description: "Premium cotton, bold style.",
    image:
      "https://i.pinimg.com/736x/af/06/2f/af062f08da5ee8e158f7a96640e0da15.jpg",
  },
  {
    id: 10,
    name: "H&M",
    price: "৳800.00",
    tag: "New",
    description: "Warm, comfy, standout.",
    image:
      "https://i.pinimg.com/736x/15/de/9c/15de9ce0aa2e951db2bb096d7de0bbcd.jpg",
  },
  {
    id: 11,
    name: "Zara",
    price: "৳800.00",
    tag: "Best Seller",
    description: "Modern fit, durable fabric.",
    image:
      "https://i.pinimg.com/736x/d5/69/95/d569954e1fe44045a1ea3301ed2a8d29.jpg",
  },
  {
    id: 12,
    name: "H&M",
    price: "৳849.00",
    tag: "Best Seller",
    description: "Modern fit, durable fabric.",
    image:
      "https://i.pinimg.com/1200x/81/6d/bc/816dbca7942cc46c9195b579f7f05d98.jpg",
  },
  {
    id: 13,
    name: "H&M",
    price: "৳949.00",
    tag: "Popular",
    description: "Modern fit, durable fabric.",
    image:
      "https://i.pinimg.com/736x/52/f0/0e/52f00e9ff29db3a589a347acaec1f91f.jpg",
  },
  {
    id: 14,
    name: "Zara",
    price: "৳949.00",
    tag: "Best Seller",
    description: "Modern fit, durable fabric.",
    image:
      "https://i.pinimg.com/1200x/86/ed/ee/86edee2c63015609dce0a5b6836bca03.jpg",
  },
  {
    id: 15,
    name: "Tom Ford",
    price: "৳800.00",
    tag: "New",
    description: "Warm, comfy, standout.",
    image:
      "https://i.pinimg.com/736x/22/cc/a9/22cca9669c6c59ab7e3dc93fdec3a9e0.jpg",
  },
  {
    id: 16,
    name: "Zara",
    price: "৳800.00",
    tag: "Limited",
    description: "Statement piece, all-weather.",
    image:
      "https://i.pinimg.com/1200x/e1/6a/e5/e16ae5df4e2043f83a23abe487ebb405.jpg",
  },
  {
    id: 17,
    name: "Turnbull & Asser",
    price: "৳999.00",
    tag: "Limited",
    description: "Premium cotton, bold style.",
    image:
      "https://i.pinimg.com/736x/72/4e/d2/724ed2b6df8deb5a50edf389ab52a04b.jpg",
  },
  {
    id: 18,
    name: "Brioni",
    price: "৳949.00",
    tag: "Limited",
    description: "Statement piece, all-weather.",
    image:
      "https://i.pinimg.com/736x/7f/fb/47/7ffb474c694ac0e6dc7fc7b5cbc85294.jpg",
  },
  {
    id: 19,
    name: "J.Crew",
    price: "৳800.00",
    tag: "New",
    description: "Premium cotton, bold style.",
    image:
      "https://i.pinimg.com/736x/e3/b5/f2/e3b5f207929f42a0aae717e3f6cf4792.jpg",
  },
  {
    id: 20,
    name: "J.Crew",
    price: "৳800.00",
    tag: "New",
    description: "Premium cotton, bold style.",
    image:
      "https://i.pinimg.com/736x/70/0d/8d/700d8deed6cce77a7855bcf5a215e34e.jpg",
  },
  {
    id: 21,
    name: "J.Crew",
    price: "৳800.00",
    tag: "New",
    description: "Premium cotton, bold style.",
    image:
      "https://i.pinimg.com/736x/bb/9b/6c/bb9b6c06eac1c4649bf88c3e5652eb95.jpg",
  },
  {
    id: 22,
    name: "Bonobos",
    price: "৳800.00",
    tag: "New",
    description: "Modern fit, durable fabric.",
    image:
      "https://i.pinimg.com/1200x/f3/20/e1/f320e182c83ae9691445737c86e6ac80.jpg",
  },
  {
    id: 23,
    name: "Zara",
    price: "৳800.00",
    tag: "Popular",
    description: "Statement piece, all-weather.",
    image:
      "https://i.pinimg.com/736x/e2/9b/01/e29b01f723282f1240fc56d25d9d5b7c.jpg",
  },
  {
    id: 24,
    name: "Zara",
    price: "৳800.00",
    tag: "Popular",
    description: "Statement piece, all-weather.",
    image:
      "https://i.pinimg.com/1200x/ca/10/d4/ca10d42d33dd7dcad71e1e67286a3e28.jpg",
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
