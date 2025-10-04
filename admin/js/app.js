// JUDN Admin Panel - Main Application Entry Point
import { renderKPICards } from './ui.js';
import { initializeFilters } from './filters.js';
import { initializeTable } from './table.js';
import { initializeModal } from './modal.js';
import { fetchOrders } from './firebase-hooks.js';

// Global JUDN namespace
window.JUDN = {
    // Event system for cross-module communication
    events: {},
    
    // Subscribe to events
    on: function(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },
    
    // Emit events
    emit: function(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    },
    
    // Authentication hooks (placeholder for Firebase integration)
    onAuthChange: function(callback) {
        // This will be replaced with Firebase Auth listener
        console.log('Auth change listener registered');
        // For now, simulate authenticated state
        setTimeout(() => callback({ uid: 'mock-user', email: 'admin@judn.com' }), 100);
    },
    
    // WhatsApp integration
    whatsapp: function(order) {
        const phone = order.customer?.phone || '+8801234567890';
        const message = `Hi ${order.customer?.name || 'there'}, regarding your order #${order.id}`;
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phone}?text=${encodedMessage}`;
        window.open(url, '_blank');
    },
    
    // Utility functions
    formatCurrency: function(amount, currency = 'BDT') {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    },
    
    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }
};

class AdminApp {
    constructor() {
        this.isSidebarCollapsed = false;
        this.currentTab = 'orders';
        this.init();
    }
    
    init() {
        this.initializeUI();
        this.attachEventListeners();
        this.initializeModules();
        this.loadInitialData();
        this.setupResponsiveBehavior();
    }
    
    initializeUI() {
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
        
        // Set initial active tab
        this.setActiveTab(this.currentTab);
        
        // Initialize sidebar state
        this.updateSidebarState();
    }
    
    attachEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Navigation tabs
        const navLinks = document.querySelectorAll('[data-tab]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
        
        // Sign out button
        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => this.handleSignOut());
        }
        
        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.handleExport());
        }
        
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                window.JUDN.emit('search:change', e.target.value);
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }
    
    initializeModules() {
        try {
            // Initialize filters
            initializeFilters();
            
            // Initialize table
            initializeTable();
            
            // Initialize modal
            initializeModal();
            
            console.log('✅ All modules initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing modules:', error);
        }
    }
    
    async loadInitialData() {
        try {
            // Show loading state
            this.setLoadingState(true);
            
            // Fetch initial orders data
            const orders = await fetchOrders({});
            
            // Render KPI cards
            const stats = this.calculateStats(orders);
            renderKPICards(stats);
            
            // Emit data loaded event
            window.JUDN.emit('data:loaded', orders);
            
            console.log('✅ Initial data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading initial data:', error);
            window.JUDN.emit('error', 'Failed to load initial data');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    calculateStats(orders) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const todayOrders = orders.filter(order => new Date(order.createdAt) >= today);
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
        const pendingOrders = orders.filter(order => ['new', 'processing'].includes(order.status));
        
        return {
            todayOrders: todayOrders.length,
            revenue: totalRevenue,
            aov: avgOrderValue,
            pending: pendingOrders.length
        };
    }
    
    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        this.updateSidebarState();
        
        // Update ARIA attributes
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.setAttribute('aria-expanded', !this.isSidebarCollapsed);
        }
        
        // Update icon
        const icon = sidebarToggle?.querySelector('i');
        if (icon) {
            if (this.isSidebarCollapsed) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            // Re-initialize the icon
            if (window.lucide) {
                lucide.createIcons();
            }
        }
    }
    
    updateSidebarState() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        if (this.isSidebarCollapsed) {
            sidebar.classList.add('sidebar-collapsed');
            mainContent.classList.add('main-expanded');
        } else {
            sidebar.classList.remove('sidebar-collapsed');
            mainContent.classList.remove('main-expanded');
        }
    }
    
    switchTab(tab) {
        // Update active tab
        this.currentTab = tab;
        this.setActiveTab(tab);
        
        // Update page title
        const pageTitle = document.querySelector('header h1');
        if (pageTitle) {
            const titles = {
                dashboard: 'Dashboard Overview',
                orders: 'Orders Management',
                products: 'Products Management',
                customers: 'Customers Management',
                settings: 'System Settings'
            };
            pageTitle.textContent = titles[tab] || 'Admin Panel';
        }
        
        // Emit tab change event
        window.JUDN.emit('tab:change', tab);
        
        // Handle tab-specific logic
        switch (tab) {
            case 'orders':
                this.loadOrdersData();
                break;
            case 'dashboard':
                this.loadDashboardData();
                break;
            default:
                this.showComingSoon(tab);
                break;
        }
    }
    
    setActiveTab(tab) {
        // Remove active state from all tabs
        const navLinks = document.querySelectorAll('[data-tab]');
        navLinks.forEach(link => {
            link.classList.remove('bg-primary/10', 'text-primary', 'border-primary/20');
            link.classList.add('bg-muted', 'text-textMuted');
        });
        
        // Add active state to current tab
        const activeLink = document.querySelector(`[data-tab="${tab}"]`);
        if (activeLink) {
            activeLink.classList.remove('bg-muted', 'text-textMuted');
            activeLink.classList.add('bg-primary/10', 'text-primary', 'border-primary/20');
        }
    }
    
    async loadOrdersData() {
        try {
            const orders = await fetchOrders({});
            window.JUDN.emit('orders:loaded', orders);
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }
    
    async loadDashboardData() {
        try {
            const orders = await fetchOrders({});
            const stats = this.calculateStats(orders);
            renderKPICards(stats);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    
    showComingSoon(tab) {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="flex items-center justify-center h-64">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="construction" class="w-8 h-8 text-textMuted"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-text mb-2">Coming Soon</h2>
                        <p class="text-textMuted">${tab.charAt(0).toUpperCase() + tab.slice(1)} management will be available soon!</p>
                    </div>
                </div>
            `;
            
            // Re-initialize icons
            if (window.lucide) {
                lucide.createIcons();
            }
        }
    }
    
    handleSignOut() {
        // This will be replaced with Firebase Auth sign out
        if (confirm('Are you sure you want to sign out?')) {
            window.location.href = 'login.html';
        }
    }
    
    handleExport() {
        window.JUDN.emit('export:requested');
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            window.JUDN.emit('modal:close');
        }
        
        // Ctrl/Cmd + B to toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            this.toggleSidebar();
        }
    }
    
    setupResponsiveBehavior() {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                // Mobile: ensure sidebar is collapsed
                if (!this.isSidebarCollapsed) {
                    this.isSidebarCollapsed = true;
                    this.updateSidebarState();
                }
            } else {
                // Desktop: ensure sidebar is visible
                if (this.isSidebarCollapsed) {
                    this.isSidebarCollapsed = false;
                    this.updateSidebarState();
                }
            }
        };
        
        // Handle initial resize
        handleResize();
        
        // Listen for resize events
        window.addEventListener('resize', handleResize);
        
        // Add click outside to close sidebar on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 768 && this.isSidebarCollapsed === false) {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebarToggle');
                
                if (sidebar && !sidebar.contains(e.target) && !sidebarToggle?.contains(e.target)) {
                    this.toggleSidebar();
                }
            }
        });
    }
    
    setLoadingState(isLoading) {
        const body = document.body;
        if (isLoading) {
            body.classList.add('loading');
        } else {
            body.classList.remove('loading');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is available
    if (typeof window.firebase === 'undefined') {
        console.log('ℹ️ Firebase not detected, using mock data');
    } else {
        console.log('✅ Firebase detected, using real data');
    }
    
    // Initialize the admin application
    window.adminApp = new AdminApp();
    
    console.log('🚀 JUDN Admin Panel initialized successfully');
});
