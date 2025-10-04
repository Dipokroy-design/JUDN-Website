// Import Firebase modules
import { db } from './common/firebase-init.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Configuration - Update this with your merchant phone number
const MERCHANT_PHONE = '+8801234567890'; // TODO: Replace with your actual phone number

// DOM elements
const checkoutForm = document.getElementById('checkoutForm');
const orderItemsContainer = document.getElementById('orderItems');
const orderTotalElement = document.getElementById('orderTotal');
const submitBtn = document.getElementById('submitBtn');
const successOverlay = document.getElementById('successOverlay');
const successOrderId = document.getElementById('successOrderId');
const whatsappLink = document.getElementById('whatsappLink');

// Cart data structure
let cartItems = [];
let orderTotal = 0;

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    displayOrderSummary();
    setupFormValidation();
});

// Load cart data from localStorage
function loadCartFromLocalStorage() {
    try {
        const cartData = localStorage.getItem('judnCart');
        if (cartData) {
            cartItems = JSON.parse(cartData);
            calculateTotal();
        } else {
            cartItems = [];
            orderTotal = 0;
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cartItems = [];
        orderTotal = 0;
    }
}

// Calculate total order amount
function calculateTotal() {
    orderTotal = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Display order summary
function displayOrderSummary() {
    if (cartItems.length === 0) {
        orderItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No items in cart</p>';
        orderTotalElement.textContent = '৳0';
        submitBtn.disabled = true;
        return;
    }

    const itemsHTML = cartItems.map(item => `
        <div class="order-item">
            <div>
                <span class="font-medium">${item.name}</span>
                <span class="text-gray-500 text-sm"> × ${item.quantity}</span>
            </div>
            <span class="font-medium">৳${item.price * item.quantity}</span>
        </div>
    `).join('');

    orderItemsContainer.innerHTML = itemsHTML;
    orderTotalElement.textContent = `৳${orderTotal}`;
    submitBtn.disabled = false;
}

// Setup form validation
function setupFormValidation() {
    checkoutForm.addEventListener('submit', handleFormSubmission);
}

// Handle form submission
async function handleFormSubmission(event) {
    event.preventDefault();
    
    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add some items before checkout.');
        return;
    }

    // Get form data
    const formData = new FormData(checkoutForm);
    const customerData = {
        name: formData.get('customerName').trim(),
        phone: formData.get('customerPhone').trim(),
        email: formData.get('customerEmail').trim(),
        address: formData.get('customerAddress').trim()
    };

    // Validate form fields
    if (!validateForm(customerData)) {
        return;
    }

    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
        // Create order object
        const order = {
            customer: customerData,
            items: cartItems,
            total: orderTotal,
            status: 'pending',
            createdAt: serverTimestamp(),
            orderId: generateOrderId()
        };

        // Save order to Firestore
        const docRef = await addDoc(collection(db, 'orders'), order);
        
        // Show success overlay
        showSuccessOverlay(order.orderId);
        
        // Clear cart from localStorage
        localStorage.removeItem('judnCart');
        
        // Reset form
        checkoutForm.reset();
        
    } catch (error) {
        console.error('Error saving order:', error);
        alert('There was an error processing your order. Please try again.');
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Complete Order';
    }
}

// Validate form fields
function validateForm(customerData) {
    if (!customerData.name || customerData.name.length < 2) {
        alert('Please enter a valid full name (at least 2 characters).');
        return false;
    }

    if (!customerData.phone || customerData.phone.length < 10) {
        alert('Please enter a valid phone number.');
        return false;
    }

    if (!customerData.email || !isValidEmail(customerData.email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (!customerData.address || customerData.address.length < 10) {
        alert('Please enter a complete delivery address (at least 10 characters).');
        return false;
    }

    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate unique order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `JUDN-${timestamp}-${randomStr}`.toUpperCase();
}

// Show success overlay
function showSuccessOverlay(orderId) {
    successOrderId.textContent = orderId;
    
    // Create WhatsApp message
    const message = `Hello! I just placed an order (${orderId}) on JUDN website. Please confirm my order details.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${MERCHANT_PHONE.replace('+', '')}?text=${encodedMessage}`;
    
    whatsappLink.href = whatsappUrl;
    
    // Show overlay
    successOverlay.style.display = 'flex';
}

// Close success overlay
function closeSuccessOverlay() {
    successOverlay.style.display = 'none';
    
    // Redirect to home page or cart page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Make closeSuccessOverlay available globally
window.closeSuccessOverlay = closeSuccessOverlay;

