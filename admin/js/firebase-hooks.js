// JUDN Admin Panel - Firebase Hooks Module
import { fetchMockOrders, updateMockOrderStatus } from './data-mock.js';

// Check if Firebase is available
const isFirebaseAvailable = typeof window.firebase !== 'undefined';

// Firebase hooks - fallback to mock data if Firebase not available
export async function fetchOrders(filters = {}) {
    if (isFirebaseAvailable) {
        try {
            return await fetchFirestoreOrders(filters);
        } catch (error) {
            console.warn('Firestore fetch failed, falling back to mock data:', error);
            return await fetchMockOrders(filters);
        }
    } else {
        return await fetchMockOrders(filters);
    }
}

export async function onOrdersRealtime(callback) {
    if (isFirebaseAvailable) {
        try {
            return await setupFirestoreRealtime(callback);
        } catch (error) {
            console.warn('Firestore realtime setup failed:', error);
            // Fallback to polling mock data
            return setupMockDataPolling(callback);
        }
    } else {
        return setupMockDataPolling(callback);
    }
}

export async function updateOrderStatus(orderId, newStatus) {
    if (isFirebaseAvailable) {
        try {
            return await updateFirestoreOrderStatus(orderId, newStatus);
        } catch (error) {
            console.warn('Firestore update failed, falling back to mock:', error);
            return await updateMockOrderStatus(orderId, newStatus);
        }
    } else {
        return await updateMockOrderStatus(orderId, newStatus);
    }
}

// Firestore implementation
async function fetchFirestoreOrders(filters = {}) {
    // This would be implemented with real Firestore queries
    // For now, return mock data to avoid errors
    console.log('Firestore fetchOrders called with filters:', filters);
    return await fetchMockOrders(filters);
}

async function setupFirestoreRealtime(callback) {
    // This would set up real-time Firestore listeners
    // For now, return a cleanup function that does nothing
    console.log('Firestore realtime setup called');
    return () => {
        console.log('Firestore realtime cleanup called');
    };
}

async function updateFirestoreOrderStatus(orderId, newStatus) {
    // This would update the order status in Firestore
    // For now, return mock response to avoid errors
    console.log('Firestore updateOrderStatus called:', orderId, newStatus);
    return await updateMockOrderStatus(orderId, newStatus);
}

// Mock data polling fallback
function setupMockDataPolling(callback) {
    let intervalId;
    
    const startPolling = () => {
        intervalId = setInterval(async () => {
            try {
                const orders = await fetchMockOrders({});
                callback(orders);
            } catch (error) {
                console.error('Mock data polling error:', error);
            }
        }, 30000); // Poll every 30 seconds
    };
    
    const stopPolling = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };
    
    // Start polling immediately
    startPolling();
    
    // Return cleanup function
    return () => {
        stopPolling();
    };
}

// Export utility functions
export function isFirebaseReady() {
    return isFirebaseAvailable;
}

export function getFirebaseStatus() {
    return {
        available: isFirebaseAvailable,
        status: isFirebaseAvailable ? 'connected' : 'mock-data'
    };
}

// Default export
export default {
    fetchOrders,
    onOrdersRealtime,
    updateOrderStatus,
    isFirebaseReady,
    getFirebaseStatus
};
