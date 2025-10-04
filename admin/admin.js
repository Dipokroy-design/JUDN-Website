// Import Firebase modules
import { auth, db } from '../common/firebase-init.js';
import { 
    signInWithPopup, 
    GithubAuthProvider, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    updateDoc,
    where,
    getDocs
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Configuration
const MERCHANT_PHONE = '+8801884903850'; // TODO: Replace with your actual phone number

// DOM elements
const loginOverlay = document.getElementById('loginOverlay');
const loginButtons = document.getElementById('loginButtons');
const emailLoginForm = document.getElementById('emailLoginForm');
const userInfo = document.getElementById('userInfo');
const githubLoginBtn = document.getElementById('githubLoginBtn');
const emailLoginBtn = document.getElementById('emailLoginBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const emailForm = document.getElementById('emailForm');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

// Orders data
let orders = [];
let ordersListener = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    setupAuthListeners();
    setupEventListeners();
    checkAuthState();
});

// Setup authentication event listeners
function setupAuthListeners() {
    // GitHub login
    githubLoginBtn.addEventListener('click', signInWithGithub);
    
    // Email login button
    emailLoginBtn.addEventListener('click', showEmailLoginForm);
    
    // Back to login buttons
    backToLoginBtn.addEventListener('click', showLoginButtons);
    
    // Email form submission
    emailForm.addEventListener('submit', handleEmailLogin);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
}

// Setup other event listeners
function setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

// Check authentication state
function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            showAdminPanel(user);
            startOrdersListener();
        } else {
            // User is signed out
            showLoginOverlay();
            stopOrdersListener();
        }
    });
}

// Show login overlay
function showLoginOverlay() {
    loginOverlay.style.display = 'flex';
    loginButtons.style.display = 'block';
    emailLoginForm.style.display = 'none';
    userInfo.style.display = 'none';
}

// Show email login form
function showEmailLoginForm() {
    loginButtons.style.display = 'none';
    emailLoginForm.style.display = 'block';
}

// Show login buttons
function showLoginButtons() {
    loginButtons.style.display = 'block';
    emailLoginForm.style.display = 'none';
}

// Show admin panel
function showAdminPanel(user) {
    loginOverlay.style.display = 'none';
    
    // Update user info
    if (user.photoURL) {
        userAvatar.src = user.photoURL;
    } else {
        userAvatar.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNlZjc0NzQiLz4KPHN2ZyB4PSIxMCIgeT0iMTIiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEwIDEwQzEyLjc2MSAxMCAxNSA3Ljc2MTQyIDE1IDVDMTUgMi4yMzg1OCAxMi43NjEgMCAxMCAwQzcuMjM4NTggMCA1IDIuMjM4NTggNSA1QzUgNy43NjE0MiA3LjIzODU4IDEwIDEwIDEwWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwIDIwQzE1LjUyMjggMjAgMjAgMTUuNTIyOCAyMCAxMEgyMEMyMCAxNS41MjI4IDE1LjUyMjggMjAgMTAgMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
    }
    
    userName.textContent = user.displayName || user.email;
    userEmail.textContent = user.email;
    
    // Show dashboard by default
    showSection('dashboard');
}

// Sign in with GitHub
async function signInWithGithub() {
    try {
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error('GitHub login error:', error);
        alert('GitHub login failed: ' + error.message);
    }
}

// Handle email login
async function handleEmailLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Email login error:', error);
        alert('Email login failed: ' + error.message);
    }
}

// Handle logout
async function handleLogout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
}

// Start orders listener
function startOrdersListener() {
    if (ordersListener) return;
    
    const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
    );
    
    ordersListener = onSnapshot(ordersQuery, (snapshot) => {
        orders = [];
        snapshot.forEach((doc) => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        updateOrdersDisplay();
        updateDashboardStats();
    }, (error) => {
        console.error('Orders listener error:', error);
    });
}

// Stop orders listener
function stopOrdersListener() {
    if (ordersListener) {
        ordersListener();
        ordersListener = null;
    }
}

// Update orders display
function updateOrdersDisplay() {
    // Update recent orders table
    const recentOrdersTable = document.getElementById('recentOrdersTable');
    if (recentOrdersTable) {
        const recentOrders = orders.slice(0, 5); // Show only 5 most recent
        
        recentOrdersTable.innerHTML = recentOrders.map(order => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${order.orderId}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${order.customer.name}</div>
                    <div class="text-sm text-gray-500">${order.customer.phone}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${order.items.length} items</div>
                    <div class="text-sm text-gray-500">৳${order.total}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full status-${order.status}">
                        ${order.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatDate(order.createdAt)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="changeOrderStatus('${order.id}', '${order.status}')" class="text-red-600 hover:text-red-900 mr-2">
                        Update Status
                    </button>
                    <button onclick="sendWhatsApp('${order.customer.phone}', '${order.orderId}')" class="text-green-600 hover:text-green-900">
                        WhatsApp
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // Update orders section if visible
    if (document.getElementById('ordersSection').classList.contains('hidden') === false) {
        updateOrdersSection();
    }
}

// Update orders section
function updateOrdersSection() {
    const ordersSection = document.getElementById('ordersSection');
    if (!ordersSection) return;
    
    ordersSection.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Orders Management</h2>
            <div class="flex space-x-2">
                <button onclick="exportOrdersCSV()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    <i class="fas fa-download mr-2"></i>Export CSV
                </button>
            </div>
        </div>
        
        <div class="bg-white shadow rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${orders.map(order => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">${order.orderId}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">${order.customer.name}</div>
                                <div class="text-sm text-gray-500">${order.customer.phone}</div>
                                <div class="text-sm text-gray-500">${order.customer.email}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">${order.items.length} items</div>
                                <div class="text-sm text-gray-500">${order.items.map(item => item.name).join(', ')}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ৳${order.total}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <select onchange="changeOrderStatus('${order.id}', this.value)" class="text-sm border border-gray-300 rounded px-2 py-1">
                                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                </select>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${formatDate(order.createdAt)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="sendWhatsApp('${order.customer.phone}', '${order.orderId}')" class="text-green-600 hover:text-green-900 mr-2">
                                    <i class="fab fa-whatsapp mr-1"></i>Contact
                                </button>
                                <button onclick="viewOrderDetails('${order.id}')" class="text-blue-600 hover:text-blue-900">
                                    <i class="fas fa-eye mr-1"></i>View
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Update dashboard stats
function updateDashboardStats() {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Update stats cards if they exist
    const statsCards = document.querySelectorAll('.stat-card');
    statsCards.forEach(card => {
        const statType = card.getAttribute('data-stat');
        const valueElement = card.querySelector('.stat-value');
        
        if (valueElement) {
            switch (statType) {
                case 'total-orders':
                    valueElement.textContent = totalOrders;
                    break;
                case 'pending-orders':
                    valueElement.textContent = pendingOrders;
                    break;
                case 'total-revenue':
                    valueElement.textContent = `৳${totalRevenue}`;
                    break;
            }
        }
    });
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('bg-red-50', 'text-red-600'));
    
    // Show selected section
    const selectedSection = document.getElementById(sectionName + 'Section');
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }
    
    // Add active class to nav item
    const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('bg-red-50', 'text-red-600');
    }
}

// Change order status
async function changeOrderStatus(orderId, newStatus) {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
            status: newStatus,
            updatedAt: new Date()
        });
        
        alert('Order status updated successfully!');
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status: ' + error.message);
    }
}

// Send WhatsApp message
function sendWhatsApp(phone, orderId) {
    const message = `Hello! I'm contacting you regarding your order ${orderId} on JUDN website.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone.replace('+', '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// View order details
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const details = `
Order ID: ${order.orderId}
Customer: ${order.customer.name}
Phone: ${order.customer.phone}
Email: ${order.customer.email}
Address: ${order.customer.address}
Status: ${order.status}
Total: ৳${order.total}
Date: ${formatDate(order.createdAt)}

Items:
${order.items.map(item => `- ${item.name} × ${item.quantity} = ৳${item.price * item.quantity}`).join('\n')}
    `;
    
    alert(details);
}

// Export orders to CSV
function exportOrdersCSV() {
    if (orders.length === 0) {
        alert('No orders to export');
        return;
    }
    
    const csvContent = generateCSV(orders);
    downloadCSV(csvContent, `judn-orders-${new Date().toISOString().split('T')[0]}.csv`);
}

// Generate CSV content
function generateCSV(orders) {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Email', 'Address', 'Items', 'Total', 'Status', 'Date'];
    
    const rows = orders.map(order => [
        order.orderId,
        order.customer.name,
        order.customer.phone,
        order.customer.email,
        order.customer.address,
        order.items.map(item => `${item.name} × ${item.quantity}`).join('; '),
        order.total,
        order.status,
        formatDate(order.createdAt)
    ]);
    
    return [headers, ...rows].map(row => 
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
}

// Download CSV file
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Format date
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Make functions available globally
window.changeOrderStatus = changeOrderStatus;
window.sendWhatsApp = sendWhatsApp;
window.viewOrderDetails = viewOrderDetails;
window.exportOrdersCSV = exportOrdersCSV;
