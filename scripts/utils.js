// Utility functions for JUDN website

/**
 * Format currency in Bangladeshi Taka
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'BDT')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'BDT') {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return '৳0';
    }
    
    // Format with thousands separator
    const formattedAmount = amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
    
    return `৳${formattedAmount}`;
}

/**
 * Generate a unique order ID
 * @param {string} prefix - Prefix for the order ID (default: 'JUDN')
 * @returns {string} Generated order ID
 */
export function generateOrderId(prefix = 'JUDN') {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `${prefix}-${timestamp}-${randomStr}`.toUpperCase();
}

/**
 * Download data as CSV file
 * @param {Array} data - Array of objects to convert to CSV
 * @param {Array} headers - Array of header names
 * @param {string} filename - Name of the file to download
 */
export function downloadCSV(data, headers, filename) {
    if (!Array.isArray(data) || data.length === 0) {
        console.error('Invalid data for CSV export');
        return;
    }
    
    // Convert data to CSV format
    const csvContent = convertToCSV(data, headers);
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename || 'export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects
 * @param {Array} headers - Array of header names
 * @returns {string} CSV formatted string
 */
function convertToCSV(data, headers) {
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.map(header => `"${header}"`).join(','));
    
    // Add data rows
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            // Escape quotes and wrap in quotes if contains comma or newline
            const escapedValue = String(value).replace(/"/g, '""');
            return `"${escapedValue}"`;
        });
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

/**
 * Format date to readable string
 * @param {Date|Timestamp} date - Date to format
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted date string
 */
export function formatDate(date, locale = 'en-US') {
    if (!date) return 'N/A';
    
    try {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        
        if (isNaN(dateObj.getTime())) {
            return 'Invalid Date';
        }
        
        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Validate email address format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validate phone number format (Bangladesh)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
export function isValidPhone(phone) {
    if (typeof phone !== 'string') return false;
    
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Bangladesh phone numbers: 11 digits starting with 01, or 13 digits starting with +8801
    return cleanPhone.length === 11 && cleanPhone.startsWith('01') ||
           cleanPhone.length === 13 && cleanPhone.startsWith('8801');
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export function formatPhone(phone) {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 11 && cleanPhone.startsWith('01')) {
        return `+880 ${cleanPhone.slice(1, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
    } else if (cleanPhone.length === 13 && cleanPhone.startsWith('8801')) {
        return `+880 ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 9)} ${cleanPhone.slice(9)}`;
    }
    
    return phone; // Return original if can't format
}

/**
 * Create WhatsApp link
 * @param {string} phone - Phone number
 * @param {string} message - Message to pre-fill
 * @returns {string} WhatsApp URL
 */
export function createWhatsAppLink(phone, message = '') {
    if (!phone) return '#';
    
    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Ensure it starts with country code
    let formattedPhone = cleanPhone;
    if (cleanPhone.length === 11 && cleanPhone.startsWith('01')) {
        formattedPhone = '880' + cleanPhone.slice(1);
    }
    
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show loading spinner
 * @param {boolean} show - Whether to show or hide spinner
 * @param {string} message - Loading message
 */
export function showLoading(show = true, message = 'Loading...') {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
        const messageEl = spinner.querySelector('.loading-message');
        if (messageEl) {
            messageEl.textContent = message;
        }
    }
}

/**
 * Show notification/toast message
 * @param {string} message - Message to show
 * @param {string} type - Type of notification ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
export function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 notification-${type}`;
    
    // Set background color based on type
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    notification.className += ` ${colors[type] || colors.info} text-white`;
    
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                ×
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

