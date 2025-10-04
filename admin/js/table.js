// JUDN Admin Panel - Orders Table Module
import { fetchOrders, updateOrderStatus } from './firebase-hooks.js';
import { renderStatusBadge, createPagination, createEmptyState, showToast } from './ui.js';

class OrdersTable {
    constructor() {
        this.orders = [];
        this.filteredOrders = [];
        this.currentPage = 1;
        this.pageSize = 25;
        this.sortField = 'createdAt';
        this.sortDirection = 'desc';
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.loadOrders();
    }
    
    attachEventListeners() {
        // Listen for filter changes
        window.JUDN.on('filters:change', (filters) => {
            this.currentPage = 1;
            this.loadOrders(filters);
        });
        
        // Listen for export requests
        window.JUDN.on('export:requested', () => {
            this.exportToCSV();
        });
        
        // Listen for orders loaded
        window.JUDN.on('orders:loaded', (orders) => {
            this.orders = orders;
            this.renderTable();
        });
    }
    
    async loadOrders(filters = {}) {
        try {
            this.setLoadingState(true);
            
            const response = await fetchOrders({
                ...filters,
                page: this.currentPage,
                limit: this.pageSize
            });
            
            this.orders = response.orders || [];
            this.totalOrders = response.total || 0;
            this.totalPages = response.totalPages || 1;
            
            this.renderTable();
            
        } catch (error) {
            console.error('Error loading orders:', error);
            showToast('Failed to load orders', 'error');
            this.renderErrorState();
        } finally {
            this.setLoadingState(false);
        }
    }
    
    renderTable() {
        const tableContainer = document.getElementById('ordersTable');
        if (!tableContainer) return;
        
        if (this.orders.length === 0) {
            tableContainer.innerHTML = createEmptyState(
                'package',
                'No Orders Found',
                'No orders match your current filters. Try adjusting your search criteria or clear all filters.',
                '<button onclick="window.tableManager.loadOrders()" class="px-4 py-2 bg-primary text-bg rounded-lg hover:bg-primaryHover transition-colors">Load All Orders</button>'
            );
            return;
        }
        
        // Check if mobile view
        const isMobile = window.innerWidth < 640;
        
        if (isMobile) {
            this.renderMobileCards();
        } else {
            this.renderDesktopTable();
        }
        
        // Re-initialize icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }
    
    renderDesktopTable() {
        const tableContainer = document.getElementById('ordersTable');
        
        const tableHTML = `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-muted border-b border-border">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider cursor-pointer hover:text-text transition-colors" onclick="window.tableManager.sortBy('id')">
                                Order ID
                                ${this.getSortIcon('id')}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider cursor-pointer hover:text-text transition-colors" onclick="window.tableManager.sortBy('customer.name')">
                                Customer
                                ${this.getSortIcon('customer.name')}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider">
                                Items
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider cursor-pointer hover:text-text transition-colors" onclick="window.tableManager.sortBy('total')">
                                Total
                                ${this.getSortIcon('total')}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider cursor-pointer hover:text-text transition-colors" onclick="window.tableManager.sortBy('status')">
                                Status
                                ${this.getSortIcon('status')}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider cursor-pointer hover:text-text transition-colors" onclick="window.tableManager.sortBy('createdAt')">
                                Created
                                ${this.getSortIcon('createdAt')}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-surface divide-y divide-border">
                        ${this.orders.map(order => this.renderTableRow(order)).join('')}
                    </tbody>
                </table>
            </div>
            ${this.renderPagination()}
        `;
        
        tableContainer.innerHTML = tableHTML;
    }
    
    renderMobileCards() {
        const tableContainer = document.getElementById('ordersTable');
        
        const cardsHTML = `
            <div class="space-y-4 p-4">
                ${this.orders.map(order => this.renderMobileCard(order)).join('')}
            </div>
            ${this.renderPagination()}
        `;
        
        tableContainer.innerHTML = cardsHTML;
    }
    
    renderTableRow(order) {
        return `
            <tr class="hover:bg-muted/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-text">${order.id}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-text">${order.customer.name}</div>
                    <div class="text-sm text-textMuted">${order.customer.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-text">${order.items.length} item(s)</div>
                    <div class="text-sm text-textMuted">${order.items[0]?.product || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-text">${window.JUDN.formatCurrency(order.total)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${renderStatusBadge(order.status)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-text">${window.JUDN.formatDate(order.createdAt)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${this.renderActionButtons(order)}
                </td>
            </tr>
        `;
    }
    
    renderMobileCard(order) {
        return `
            <div class="table-card">
                <div class="card-header">
                    <div class="flex items-center space-x-3">
                        <div class="text-lg font-bold text-text">${order.id}</div>
                        ${renderStatusBadge(order.status)}
                    </div>
                    <div class="text-sm text-textMuted">${window.JUDN.formatDate(order.createdAt)}</div>
                </div>
                
                <div class="card-content">
                    <div>
                        <div class="text-sm font-medium text-text">${order.customer.name}</div>
                        <div class="text-xs text-textMuted">${order.customer.email}</div>
                    </div>
                    <div>
                        <div class="text-sm text-text">${order.items.length} item(s)</div>
                        <div class="text-xs text-textMuted">${order.items[0]?.product || 'N/A'}</div>
                    </div>
                    <div>
                        <div class="text-sm font-bold text-text">${window.JUDN.formatCurrency(order.total)}</div>
                        <div class="text-xs text-textMuted">Total</div>
                    </div>
                    <div class="status-badge">
                        ${renderStatusBadge(order.status)}
                    </div>
                </div>
                
                <div class="card-actions">
                    ${this.renderActionButtons(order)}
                </div>
            </div>
        `;
    }
    
    renderActionButtons(order) {
        return `
            <div class="flex items-center space-x-2">
                <button onclick="window.tableManager.viewOrder('${order.id}')" 
                        class="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors" 
                        title="View Details">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
                
                <div class="relative">
                    <button onclick="window.tableManager.toggleStatusMenu('${order.id}')" 
                            class="p-1.5 text-textMuted hover:bg-muted rounded-md transition-colors" 
                            title="Change Status">
                        <i data-lucide="more-horizontal" class="w-4 h-4"></i>
                    </button>
                    
                    <div id="statusMenu-${order.id}" class="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-hard z-10 hidden">
                        <div class="py-1">
                            <button onclick="window.tableManager.updateStatus('${order.id}', 'new')" 
                                    class="w-full text-left px-4 py-2 text-sm text-text hover:bg-muted transition-colors">
                                Set as New
                            </button>
                            <button onclick="window.tableManager.updateStatus('${order.id}', 'processing')" 
                                    class="w-full text-left px-4 py-2 text-sm text-text hover:bg-muted transition-colors">
                                Set as Processing
                            </button>
                            <button onclick="window.tableManager.updateStatus('${order.id}', 'shipped')" 
                                    class="w-full text-left px-4 py-2 text-sm text-text hover:bg-muted transition-colors">
                                Set as Shipped
                            </button>
                            <button onclick="window.tableManager.updateStatus('${order.id}', 'completed')" 
                                    class="w-full text-left px-4 py-2 text-sm text-text hover:bg-muted transition-colors">
                                Set as Completed
                            </button>
                            <button onclick="window.tableManager.updateStatus('${order.id}', 'cancelled')" 
                                    class="w-full text-left px-4 py-2 text-sm text-text hover:bg-muted transition-colors">
                                Set as Cancelled
                            </button>
                        </div>
                    </div>
                </div>
                
                <button onclick="window.JUDN.whatsapp(${JSON.stringify(order).replace(/"/g, '&quot;')})" 
                        class="p-1.5 text-success hover:bg-success/10 rounded-md transition-colors" 
                        title="WhatsApp Customer">
                    <i data-lucide="message-circle" class="w-4 h-4"></i>
                </button>
                
                <button onclick="window.tableManager.copyOrderId('${order.id}')" 
                        class="p-1.5 text-textMuted hover:bg-muted rounded-md transition-colors" 
                        title="Copy Order ID">
                    <i data-lucide="copy" class="w-4 h-4"></i>
                </button>
            </div>
        `;
    }
    
    renderPagination() {
        if (this.totalPages <= 1) return '';
        
        return createPagination(this.currentPage, this.totalPages, (page) => {
            this.currentPage = page;
            this.loadOrders();
        });
    }
    
    getSortIcon(field) {
        if (this.sortField !== field) {
            return '<i data-lucide="chevron-up" class="w-4 h-4 text-textMuted"></i>';
        }
        
        return this.sortDirection === 'asc' 
            ? '<i data-lucide="chevron-up" class="w-4 h-4 text-primary"></i>'
            : '<i data-lucide="chevron-down" class="w-4 h-4 text-primary"></i>';
    }
    
    sortBy(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        
        this.sortOrders();
        this.renderTable();
    }
    
    sortOrders() {
        this.orders.sort((a, b) => {
            let aVal, bVal;
            
            // Handle nested properties
            if (this.sortField.includes('.')) {
                const parts = this.sortField.split('.');
                aVal = parts.reduce((obj, part) => obj?.[part], a);
                bVal = parts.reduce((obj, part) => obj?.[part], b);
            } else {
                aVal = a[this.sortField];
                bVal = b[this.sortField];
            }
            
            // Handle different data types
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    async updateStatus(orderId, newStatus) {
        try {
            this.hideAllStatusMenus();
            
            const result = await updateOrderStatus(orderId, newStatus);
            
            if (result.success) {
                // Update local order
                const order = this.orders.find(o => o.id === orderId);
                if (order) {
                    order.status = newStatus;
                    order.updatedAt = new Date().toISOString();
                }
                
                showToast(result.message, 'success');
                this.renderTable();
                
                // Emit status update event
                window.JUDN.emit('order:statusUpdated', { orderId, newStatus });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            showToast('Failed to update order status', 'error');
        }
    }
    
    viewOrder(orderId) {
        window.JUDN.emit('order:view', orderId);
    }
    
    toggleStatusMenu(orderId) {
        this.hideAllStatusMenus();
        const menu = document.getElementById(`statusMenu-${orderId}`);
        if (menu) {
            menu.classList.toggle('hidden');
        }
    }
    
    hideAllStatusMenus() {
        document.querySelectorAll('[id^="statusMenu-"]').forEach(menu => {
            menu.classList.add('hidden');
        });
    }
    
    copyOrderId(orderId) {
        navigator.clipboard.writeText(orderId).then(() => {
            showToast('Order ID copied to clipboard', 'success');
        }).catch(() => {
            showToast('Failed to copy Order ID', 'error');
        });
    }
    
    exportToCSV() {
        if (this.orders.length === 0) {
            showToast('No orders to export', 'warning');
            return;
        }
        
        try {
            const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Items', 'Total', 'Status', 'Created Date', 'Payment Method'];
            const csvContent = [
                headers.join(','),
                ...this.orders.map(order => [
                    order.id,
                    `"${order.customer.name}"`,
                    order.customer.email,
                    `"${order.items.map(item => item.product).join('; ')}"`,
                    order.total,
                    order.status,
                    new Date(order.createdAt).toLocaleDateString(),
                    order.paymentMethod
                ].join(','))
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `judn-orders-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast('Orders exported to CSV successfully', 'success');
        } catch (error) {
            console.error('Error exporting CSV:', error);
            showToast('Failed to export CSV', 'error');
        }
    }
    
    setLoadingState(isLoading) {
        this.isLoading = isLoading;
        const tableContainer = document.getElementById('ordersTable');
        if (tableContainer) {
            if (isLoading) {
                tableContainer.classList.add('loading');
            } else {
                tableContainer.classList.remove('loading');
            }
        }
    }
    
    renderErrorState() {
        const tableContainer = document.getElementById('ordersTable');
        if (tableContainer) {
            tableContainer.innerHTML = createEmptyState(
                'alert-triangle',
                'Failed to Load Orders',
                'There was an error loading the orders. Please try refreshing the page or contact support if the problem persists.',
                '<button onclick="window.tableManager.loadOrders()" class="px-4 py-2 bg-primary text-bg rounded-lg hover:bg-primaryHover transition-colors">Try Again</button>'
            );
        }
    }
    
    // Public methods
    refresh() {
        this.loadOrders();
    }
    
    getOrders() {
        return this.orders;
    }
    
    getTotalOrders() {
        return this.totalOrders;
    }
}

// Initialize table manager
export function initializeTable() {
    window.tableManager = new OrdersTable();
    return window.tableManager;
}

// Export utility functions
export function refreshTable() {
    if (window.tableManager) {
        window.tableManager.refresh();
    }
}

export function exportTableToCSV() {
    if (window.tableManager) {
        window.tableManager.exportToCSV();
    }
}

// Default export
export default {
    initializeTable,
    refreshTable,
    exportTableToCSV
};
