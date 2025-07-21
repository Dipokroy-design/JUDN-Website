# JUDN Website: Products - Pinterest-style Masonry Gallery Implementation Guide

This document explains how the **Pinterest-style Masonry Gallery** section works, how the "Buy Now" button logic is implemented, and how product details are shown on the product details page.  
It is written for future developers and maintainers of the JUDN website.

---

## 1. Gallery Section Overview

- The gallery is located in the main `index.html` file.
- It uses a CSS column layout (`columns-2`, `md:columns-3`, etc.) for a Pinterest-style masonry effect.
- Each product card contains:
  - An image
  - A brand name
  - A "Buy Now" button (visible on hover)

**Example HTML for one card:**

```html
<div
  class="autoShow break-inside-avoid overflow-hidden rounded-xl shadow-lg group relative"
>
  <img src="..." alt="Gallery" class="w-full h-auto object-cover ..." />
  <div
    class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white ..."
  >
    <h3 class="text-lg font-semibold mb-2 drop-shadow">BRAND - L.L.Bean</h3>
    <button
      class="px-4 py-2 bg-white/90 hover:bg-white/70 text-black rounded font-bold cursor-pointer shadow"
      onclick="openProductCard(1,'https://i.pinimg.com/736x/fc/a4/41/fca4412b3e955ab04a1b159df422b9dc.jpg')"
    >
      Buy Now
    </button>
  </div>
</div>
```

---

## 2. Buy Now Button Logic

### Purpose

When a user clicks **Buy Now**:

- The site should open `productCard.html`
- The correct product image and details should be displayed

### How It Works

- Each Buy Now button calls the `openProductCard(productId, imageUrl)` function.
- This function stores the product ID (and optionally the image URL) in `localStorage`.
- The browser is redirected to `productCard.html`.

**Example function (add to a global JS file or before `</body>`):**

```javascript
function openProductCard(productId, imageUrl) {
  localStorage.setItem("selectedProductId", productId);
  localStorage.setItem("selectedGalleryImage", imageUrl); // Optional, for fallback
  window.location.href = "productCard.html";
}
```

**Why both ID and image?**

- The product ID allows the details page to look up all product info from the main product array.
- The image URL is a fallback if the product is not in the array.

---

## 3. Product Details Page Logic (`productCard.html` + `productCard.js`)

### How Details Are Displayed

- On `productCard.html`, the script (`productCard.js`) checks for `selectedProductId` in `localStorage`.
- If found, it looks up the product in the `products` array and displays:
  - Image
  - Name
  - Tag
  - Price
  - Description
- If only an image is passed (no product ID), it shows the image and a default message ("No details available for this product...").

**Example logic:**

```javascript
const productId = localStorage.getItem("selectedProductId");
const product = products.find((p) => p.id == productId);

if (product) {
  // Show full product details
  document.getElementById("productImage").src = product.image;
  document.getElementById("productName").textContent = product.name;
  // ...etc
} else if (localStorage.getItem("selectedGalleryImage")) {
  // Show image and fallback message
  document.getElementById("productImage").src = localStorage.getItem(
    "selectedGalleryImage"
  );
  document.getElementById("productName").textContent = "JUDN Product";
  document.getElementById("productDesc").textContent =
    "No details available for this product. Please contact us for more information.";
}
```

---

## 4. How to Add or Update Products

- The main product data is stored in a JavaScript array (see `productCard.js`).
- Each product should have a unique `id`, `name`, `price`, `tag`, `description`, and `image`.
- When adding new products to the gallery, make sure the `productId` in the Buy Now button matches the product in the array.

**Example product object:**

```javascript
{
  id: 1,
  name: "Series-A Shirt",
  price: "৳800.00",
  tag: "New",
  description: "Premium cotton, bold style.",
  image: "https://i.pinimg.com/736x/fc/a4/41/fca4412b3e955ab04a1b159df422b9dc.jpg"
}
```

---

## 5. Masonry Gallery Design Notes

- The gallery uses Tailwind CSS for layout and styling.
- Cards use `break-inside-avoid` to prevent images from splitting across columns.
- The hover effect is achieved with `group-hover` classes.
- No product details are shown in the gallery itself—only on the details page.

---

## 6. Future Maintenance Tips

- **Always pass the correct product ID** in the Buy Now button for products with details.
- If a gallery image does not have a matching product, only the image and a default message will be shown.
- To add more product info, update the product array and the Buy Now button accordingly.
- Keep the gallery design and logic separate from the product details logic for easier updates.

---

## 7. Troubleshooting

- If product details do not show, check that the product ID passed matches an object in the product array.
- If only the image is shown, the product ID is missing or incorrect.
- Always clear `localStorage` keys after use to prevent stale data.

---
