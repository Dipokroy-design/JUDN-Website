// JUDN Admin Panel - UI Components Module

// KPI Cards Component
export function renderKPICards(stats) {
    const kpiContainer = document.getElementById('kpiCards');
    if (!kpiContainer) return;
    
    const cards = [
        {
            title: 'Today Orders',
            value: stats.todayOrders || 0,
            icon: 'package',
            color: 'primary',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Total Revenue',
            value: window.JUDN.formatCurrency(stats.revenue || 0),
            icon: 'dollar-sign',
            color: 'success',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Average Order Value',
            value: window.JUDN.formatCurrency(stats.aov || 0),
            icon: 'trending-up',
            color: 'warning',
            change: '+5%',
            changeType: 'positive'
        },
        {
            title: 'Pending Orders',
            value: stats.pending || 0,
            icon: 'clock',
            color: 'danger',
            change: '-3%',
            changeType: 'negative'
        }
    ];
    
    kpiContainer.innerHTML = cards.map(card => `
        <div class="bg-surface border border-border rounded-xl p-6 shadow-soft hover:shadow-hard transition-all duration-300 cursor-pointer group">
            <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-${card.color}/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i data-lucide="${card.icon}" class="w-6 h-6 text-${card.color}"></i>
                </div>
                <div class="text-right">
                    <span class="text-sm font-medium text-textMuted">${card.change}</span>
                    <div class="w-2 h-2 rounded-full bg-${card.changeType === 'positive' ? 'success' : 'danger'} mt-1"></div>
                </div>
            </div>
            <div>
                <p class="text-2xl font-bold text-text mb-1">${card.value}</p>
                <p class="text-sm text-textMuted">${card.title}</p>
            </div>
        </div>
    `).join('');
    
    // Re-initialize icons
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Status Badge Component
export function renderStatusBadge(status) {
    const statusConfig = {
        new: { class: 'badge-new', text: 'New', icon: 'circle' },
        processing: { class: 'badge-processing', text: 'Processing', icon: 'clock' },
        shipped: { class: 'badge-shipped', text: 'Shipped', icon: 'truck' },
        completed: { class: 'badge-completed', text: 'Completed', icon: 'check-circle' },
        cancelled: { class: 'badge-cancelled', text: 'Cancelled', icon: 'x-circle' }
    };
    
    const config = statusConfig[status] || statusConfig.new;
    
    return `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}">
            <i data-lucide="${config.icon}" class="w-3 h-3 mr-1"></i>
            ${config.text}
        </span>
    `;
}

// Toast Notification System
export function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toastId = 'toast-' + Date.now();
    const toastTypes = {
        success: { icon: 'check-circle', bg: 'bg-success/10', border: 'border-success/20', text: 'text-success' },
        error: { icon: 'x-circle', bg: 'bg-danger/10', border: 'border-danger/20', text: 'text-danger' },
        warning: { icon: 'alert-triangle', bg: 'bg-warning/10', border: 'border-warning/20', text: 'text-warning' },
        info: { icon: 'info', bg: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary' }
    };
    
    const config = toastTypes[type] || toastTypes.info;
    
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast-enter flex items-center p-4 bg-surface border ${config.border} rounded-lg shadow-soft max-w-sm`;
    toast.innerHTML = `
        <i data-lucide="${config.icon}" class="w-5 h-5 ${config.text} mr-3"></i>
        <span class="text-text">${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-auto text-textMuted hover:text-text">
            <i data-lucide="x" class="w-4 h-4"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Re-initialize icons
    if (window.lucide) {
        lucide.createIcons();
    }
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-enter-active');
    });
    
    // Auto-remove after duration
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('toast-exit');
            toast.classList.add('toast-exit-active');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }
    }, duration);
    
    return toastId;
}

// Dropdown Component
export function createDropdown(id, items, onSelect, placeholder = 'Select option') {
    const dropdown = document.createElement('div');
    dropdown.className = 'relative';
    dropdown.innerHTML = `
        <button class="dropdown-toggle flex items-center justify-between w-full px-3 py-2 bg-muted border border-border rounded-lg text-text hover:bg-mutedAlt transition-colors">
            <span class="dropdown-text">${placeholder}</span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-textMuted transition-transform"></i>
        </button>
        <div class="dropdown-menu absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-hard z-10 hidden">
            ${items.map(item => `
                <button class="dropdown-item w-full text-left px-3 py-2 text-text hover:bg-mutedAlt transition-colors" data-value="${item.value}">
                    ${item.label}
                </button>
            `).join('')}
        </div>
    `;
    
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    const text = dropdown.querySelector('.dropdown-text');
    const chevron = dropdown.querySelector('.dropdown-toggle i');
    
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('hidden');
        
        if (isOpen) {
            menu.classList.remove('hidden');
            chevron.style.transform = 'rotate(180deg)';
        } else {
            menu.classList.add('hidden');
            chevron.style.transform = 'rotate(0deg)';
        }
    });
    
    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const value = item.dataset.value;
            const label = item.textContent.trim();
            
            text.textContent = label;
            menu.classList.add('hidden');
            chevron.style.transform = 'rotate(0deg)';
            
            if (onSelect) {
                onSelect(value, label);
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            menu.classList.add('hidden');
            chevron.style.transform = 'rotate(0deg)';
        }
    });
    
    return dropdown;
}

// Date Range Picker Component
export function createDateRangePicker(onDateChange) {
    const container = document.createElement('div');
    container.className = 'relative';
    
    const presets = [
        { label: 'Today', value: 'today' },
        { label: 'Last 7 days', value: '7d' },
        { label: 'Last 30 days', value: '30d' },
        { label: 'This month', value: 'month' },
        { label: 'Custom', value: 'custom' }
    ];
    
    container.innerHTML = `
        <div class="flex items-center space-x-2">
            <div class="relative">
                <button class="date-preset-btn flex items-center space-x-2 px-3 py-2 bg-muted border border-border rounded-lg text-text hover:bg-mutedAlt transition-colors">
                    <i data-lucide="calendar" class="w-4 h-4"></i>
                    <span class="preset-text">Last 7 days</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-textMuted"></i>
                </button>
                <div class="date-preset-menu absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-hard z-10 hidden min-w-32">
                    ${presets.map(preset => `
                        <button class="date-preset-item w-full text-left px-3 py-2 text-text hover:bg-mutedAlt transition-colors" data-value="${preset.value}">
                            ${preset.label}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="date-inputs hidden">
                <input type="date" class="start-date px-2 py-2 bg-muted border border-border rounded text-text text-sm" />
                <span class="text-textMuted mx-2">to</span>
                <input type="date" class="end-date px-2 py-2 bg-muted border border-border rounded text-text text-sm" />
            </div>
        </div>
    `;
    
    const presetBtn = container.querySelector('.date-preset-btn');
    const presetMenu = container.querySelector('.date-preset-menu');
    const presetText = container.querySelector('.preset-text');
    const dateInputs = container.querySelector('.date-inputs');
    const startDate = container.querySelector('.start-date');
    const endDate = container.querySelector('.end-date');
    
    // Toggle preset menu
    presetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        presetMenu.classList.toggle('hidden');
    });
    
    // Handle preset selection
    container.querySelectorAll('.date-preset-item').forEach(item => {
        item.addEventListener('click', () => {
            const value = item.dataset.value;
            const label = item.textContent.trim();
            
            presetText.textContent = label;
            presetMenu.classList.add('hidden');
            
            if (value === 'custom') {
                dateInputs.classList.remove('hidden');
                startDate.focus();
            } else {
                dateInputs.classList.add('hidden');
                const dates = calculateDateRange(value);
                if (onDateChange) {
                    onDateChange(dates.start, dates.end);
                }
            }
        });
    });
    
    // Handle custom date changes
    [startDate, endDate].forEach(input => {
        input.addEventListener('change', () => {
            if (startDate.value && endDate.value) {
                if (onDateChange) {
                    onDateChange(startDate.value, endDate.value);
                }
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            presetMenu.classList.add('hidden');
        }
    });
    
    return container;
}

// Helper function to calculate date ranges
function calculateDateRange(preset) {
    const now = new Date();
    const start = new Date();
    
    switch (preset) {
        case 'today':
            start.setHours(0, 0, 0, 0);
            break;
        case '7d':
            start.setDate(now.getDate() - 7);
            break;
        case '30d':
            start.setDate(now.getDate() - 30);
            break;
        case 'month':
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            break;
        default:
            return { start: null, end: null };
    }
    
    return {
        start: start.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
    };
}

// Loading Spinner Component
export function createLoadingSpinner(size = 'md') {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };
    
    return `
        <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full border-2 border-primary border-t-transparent ${sizes[size]}"></div>
        </div>
    `;
}

// Empty State Component
export function createEmptyState(icon, title, description, actionButton = null) {
    return `
        <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <i data-lucide="${icon}" class="w-8 h-8 text-textMuted"></i>
            </div>
            <h3 class="text-lg font-semibold text-text mb-2">${title}</h3>
            <p class="text-textMuted mb-6 max-w-md">${description}</p>
            ${actionButton ? actionButton : ''}
        </div>
    `;
}

// Pagination Component
export function createPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return '';
    
    const pages = [];
    const maxVisible = 5;
    
    // Calculate visible page range
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }
    
    // Add first page and ellipsis
    if (start > 1) {
        pages.push({ page: 1, label: '1' });
        if (start > 2) {
            pages.push({ page: null, label: '...' });
        }
    }
    
    // Add visible pages
    for (let i = start; i <= end; i++) {
        pages.push({ page: i, label: i.toString() });
    }
    
    // Add last page and ellipsis
    if (end < totalPages) {
        if (end < totalPages - 1) {
            pages.push({ page: null, label: '...' });
        }
        pages.push({ page: totalPages, label: totalPages.toString() });
    }
    
    return `
        <div class="flex items-center justify-between px-4 py-3 bg-surface border-t border-border">
            <div class="flex items-center space-x-2">
                <button class="pagination-btn px-3 py-1 rounded-md text-textMuted hover:text-text hover:bg-muted transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" 
                        ${currentPage === 1 ? 'disabled' : ''} 
                        onclick="this.dispatchEvent(new CustomEvent('pageChange', {detail: ${currentPage - 1}}))">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i>
                    Previous
                </button>
            </div>
            
            <div class="flex items-center space-x-1">
                ${pages.map(page => `
                    ${page.page ? `
                        <button class="pagination-page px-3 py-1 rounded-md transition-colors ${page.page === currentPage ? 'bg-primary text-bg' : 'text-textMuted hover:text-text hover:bg-muted'}" 
                                onclick="this.dispatchEvent(new CustomEvent('pageChange', {detail: ${page.page}}))">
                            ${page.label}
                        </button>
                    ` : `
                        <span class="px-3 py-1 text-textMuted">${page.label}</span>
                    `}
                `).join('')}
            </div>
            
            <div class="flex items-center space-x-2">
                <button class="pagination-btn px-3 py-1 rounded-md text-textMuted hover:text-text hover:bg-muted transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" 
                        ${currentPage === totalPages ? 'disabled' : ''} 
                        onclick="this.dispatchEvent(new CustomEvent('pageChange', {detail: ${currentPage + 1}}))">
                    Next
                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `;
}

// Export all components
export default {
    renderKPICards,
    renderStatusBadge,
    showToast,
    createDropdown,
    createDateRangePicker,
    createLoadingSpinner,
    createEmptyState,
    createPagination
};
