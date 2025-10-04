// JUDN Admin Panel - Filters Module
import { showToast } from './ui.js';

class FiltersManager {
    constructor() {
        this.filters = {
            search: '',
            status: '',
            startDate: '',
            endDate: '',
            page: 1,
            limit: 25
        };
        
        this.debounceTimer = null;
        this.init();
    }
    
    init() {
        this.loadFiltersFromStorage();
        this.attachEventListeners();
        this.updateResultsCount();
    }
    
    attachEventListeners() {
        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.applyFilters();
            });
        }
        
        // Date filters
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        
        if (startDate) {
            startDate.addEventListener('change', (e) => {
                this.filters.startDate = e.target.value;
                this.validateDateRange();
            });
        }
        
        if (endDate) {
            endDate.addEventListener('change', (e) => {
                this.filters.endDate = e.target.value;
                this.validateDateRange();
            });
        }
        
        // Clear filters button
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }
        
        // Listen for search changes from main app
        window.JUDN.on('search:change', (searchTerm) => {
            this.filters.search = searchTerm;
            this.debounceSearch();
        });
        
        // Listen for date range changes
        window.JUDN.on('dateRange:change', (dates) => {
            this.filters.startDate = dates.start;
            this.filters.endDate = dates.end;
            this.applyFilters();
        });
    }
    
    debounceSearch() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.filters.page = 1; // Reset to first page on search
            this.applyFilters();
        }, 300);
    }
    
    validateDateRange() {
        if (this.filters.startDate && this.filters.endDate) {
            const start = new Date(this.filters.startDate);
            const end = new Date(this.filters.endDate);
            
            if (start > end) {
                showToast('Start date cannot be after end date', 'error');
                this.filters.endDate = '';
                if (document.getElementById('endDate')) {
                    document.getElementById('endDate').value = '';
                }
                return;
            }
            
            this.applyFilters();
        }
    }
    
    applyFilters() {
        // Reset to first page when filters change
        this.filters.page = 1;
        
        // Save filters to storage
        this.saveFiltersToStorage();
        
        // Update results count
        this.updateResultsCount();
        
        // Emit filters change event
        window.JUDN.emit('filters:change', this.filters);
        
        // Show toast for filter changes
        const activeFilters = this.getActiveFilters();
        if (activeFilters.length > 0) {
            showToast(`Filters applied: ${activeFilters.join(', ')}`, 'info', 2000);
        }
    }
    
    clearFilters() {
        this.filters = {
            search: '',
            status: '',
            startDate: '',
            endDate: '',
            page: 1,
            limit: 25
        };
        
        // Clear form inputs
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) statusFilter.value = '';
        
        const startDate = document.getElementById('startDate');
        if (startDate) startDate.value = '';
        
        const endDate = document.getElementById('endDate');
        if (endDate) endDate.value = '';
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        // Clear storage
        this.clearFiltersFromStorage();
        
        // Apply cleared filters
        this.applyFilters();
        
        showToast('All filters cleared', 'success');
    }
    
    getActiveFilters() {
        const active = [];
        
        if (this.filters.search) active.push(`Search: "${this.filters.search}"`);
        if (this.filters.status) active.push(`Status: ${this.filters.status}`);
        if (this.filters.startDate && this.filters.endDate) {
            active.push(`Date: ${this.filters.startDate} to ${this.filters.endDate}`);
        }
        
        return active;
    }
    
    getFilters() {
        return { ...this.filters };
    }
    
    setPage(page) {
        this.filters.page = page;
        this.saveFiltersToStorage();
        window.JUDN.emit('filters:change', this.filters);
    }
    
    setLimit(limit) {
        this.filters.limit = limit;
        this.filters.page = 1; // Reset to first page
        this.saveFiltersToStorage();
        window.JUDN.emit('filters:change', this.filters);
    }
    
    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            const activeFilters = this.getActiveFilters();
            if (activeFilters.length > 0) {
                resultsCount.textContent = `Filters active: ${activeFilters.length}`;
                resultsCount.className = 'text-sm text-primary';
            } else {
                resultsCount.textContent = 'No filters applied';
                resultsCount.className = 'text-sm text-textMuted';
            }
        }
    }
    
    // Storage management
    saveFiltersToStorage() {
        try {
            const filtersToSave = { ...this.filters };
            delete filtersToSave.page; // Don't persist page number
            sessionStorage.setItem('judn-filters', JSON.stringify(filtersToSave));
        } catch (error) {
            console.warn('Failed to save filters to storage:', error);
        }
    }
    
    loadFiltersFromStorage() {
        try {
            const saved = sessionStorage.getItem('judn-filters');
            if (saved) {
                const savedFilters = JSON.parse(saved);
                this.filters = { ...this.filters, ...savedFilters };
                
                // Restore form values
                const statusFilter = document.getElementById('statusFilter');
                if (statusFilter && this.filters.status) {
                    statusFilter.value = this.filters.status;
                }
                
                const startDate = document.getElementById('startDate');
                if (startDate && this.filters.startDate) {
                    startDate.value = this.filters.startDate;
                }
                
                const endDate = document.getElementById('endDate');
                if (endDate && this.filters.endDate) {
                    endDate.value = this.filters.endDate;
                }
                
                const searchInput = document.getElementById('searchInput');
                if (searchInput && this.filters.search) {
                    searchInput.value = this.filters.search;
                }
            }
        } catch (error) {
            console.warn('Failed to load filters from storage:', error);
        }
    }
    
    clearFiltersFromStorage() {
        try {
            sessionStorage.removeItem('judn-filters');
        } catch (error) {
            console.warn('Failed to clear filters from storage:', error);
        }
    }
    
    // Export filters for CSV
    exportFiltersDescription() {
        const activeFilters = this.getActiveFilters();
        if (activeFilters.length === 0) {
            return 'All orders';
        }
        return `Filtered: ${activeFilters.join(' | ')}`;
    }
    
    // Get filter summary for display
    getFilterSummary() {
        const summary = [];
        
        if (this.filters.search) {
            summary.push(`Search: "${this.filters.search}"`);
        }
        
        if (this.filters.status) {
            summary.push(`Status: ${this.filters.status}`);
        }
        
        if (this.filters.startDate && this.filters.endDate) {
            const start = new Date(this.filters.startDate).toLocaleDateString();
            const end = new Date(this.filters.endDate).toLocaleDateString();
            summary.push(`Date: ${start} - ${end}`);
        }
        
        return summary;
    }
}

// Initialize filters manager
export function initializeFilters() {
    window.filtersManager = new FiltersManager();
    return window.filtersManager;
}

// Export utility functions
export function getCurrentFilters() {
    return window.filtersManager ? window.filtersManager.getFilters() : {};
}

export function setFilter(key, value) {
    if (window.filtersManager) {
        window.filtersManager.filters[key] = value;
        window.filtersManager.applyFilters();
    }
}

export function clearAllFilters() {
    if (window.filtersManager) {
        window.filtersManager.clearFilters();
    }
}

// Default export
export default {
    initializeFilters,
    getCurrentFilters,
    setFilter,
    clearAllFilters
};
