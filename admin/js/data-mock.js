// JUDN Admin Panel - Mock Data Module

// Generate mock orders data
export function generateMockOrders(count = 100) {
    const orders = [];
    const statuses = ['new', 'processing', 'shipped', 'completed', 'cancelled'];
    const products = [
        { name: 'Premium Cotton Shirt', price: 2500, category: 'Shirts' },
        { name: 'Designer Denim Jeans', price: 4500, category: 'Jeans' },
        { name: 'Luxury Silk Dress', price: 8500, category: 'Dresses' },
        { name: 'Classic Blazer', price: 6500, category: 'Outerwear' },
        { name: 'Casual T-Shirt', price: 1200, category: 'T-Shirts' },
        { name: 'Formal Trousers', price: 3200, category: 'Trousers' },
        { name: 'Summer Skirt', price: 2800, category: 'Skirts' },
        { name: 'Winter Jacket', price: 9500, category: 'Outerwear' }
    ];
    
    const customers = [
        { name: 'Ahmed Rahman', email: 'ahmed@example.com', phone: '+8801712345678' },
        { name: 'Fatima Khan', email: 'fatima@example.com', phone: '+8801812345678' },
        { name: 'Mohammed Ali', email: 'mohammed@example.com', phone: '+8801912345678' },
        { name: 'Aisha Begum', email: 'aisha@example.com', phone: '+8801612345678' },
        { name: 'Omar Hassan', email: 'omar@example.com', phone: '+8801512345678' },
        { name: 'Zara Ahmed', email: 'zara@example.com', phone: '+8801412345678' },
        { name: 'Ibrahim Khan', email: 'ibrahim@example.com', phone: '+8801312345678' },
        { name: 'Layla Rahman', email: 'layla@example.com', phone: '+8801212345678' }
    ];
    
    const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];
    
    for (let i = 1; i <= count; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const product = products[Math.floor(Math.random() * products.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const subtotal = product.price * quantity;
        const shipping = 150;
        const total = subtotal + shipping;
        
        // Generate random date within last 90 days
        const daysAgo = Math.floor(Math.random() * 90);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);
        
        // Generate status timeline
        const timeline = generateStatusTimeline(status, createdAt);
        
        const order = {
            id: `JUDN-${String(i).padStart(6, '0')}`,
            customer: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: {
                    street: `${Math.floor(Math.random() * 999) + 1} Main Street`,
                    city: cities[Math.floor(Math.random() * cities.length)],
                    postalCode: `${Math.floor(Math.random() * 9999) + 1000}`,
                    country: 'Bangladesh'
                }
            },
            items: [{
                product: product.name,
                category: product.category,
                price: product.price,
                quantity: quantity,
                subtotal: subtotal
            }],
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            status: status,
            createdAt: createdAt.toISOString(),
            updatedAt: new Date().toISOString(),
            timeline: timeline,
            paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'Cash on Delivery',
            notes: Math.random() > 0.7 ? 'Customer requested express delivery' : '',
            trackingNumber: status === 'shipped' || status === 'completed' ? `TRK-${Math.random().toString(36).substr(2, 8).toUpperCase()}` : null
        };
        
        orders.push(order);
    }
    
    // Sort by creation date (newest first)
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Generate status timeline based on current status
function generateStatusTimeline(status, createdAt) {
    const timeline = [
        {
            status: 'new',
            timestamp: createdAt.toISOString(),
            description: 'Order placed',
            icon: 'circle'
        }
    ];
    
    const statusOrder = ['new', 'processing', 'shipped', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    
    if (currentIndex >= 1) {
        const processingTime = new Date(createdAt);
        processingTime.setHours(processingTime.getHours() + Math.floor(Math.random() * 24) + 1);
        timeline.push({
            status: 'processing',
            timestamp: processingTime.toISOString(),
            description: 'Order confirmed and processing',
            icon: 'clock'
        });
    }
    
    if (currentIndex >= 2) {
        const shippedTime = new Date(createdAt);
        shippedTime.setDate(shippedTime.getDate() + Math.floor(Math.random() * 3) + 1);
        timeline.push({
            status: 'shipped',
            timestamp: shippedTime.toISOString(),
            description: 'Order shipped',
            icon: 'truck'
        });
    }
    
    if (currentIndex >= 3) {
        const completedTime = new Date(createdAt);
        completedTime.setDate(completedTime.getDate() + Math.floor(Math.random() * 5) + 3);
        timeline.push({
            status: 'completed',
            timestamp: completedTime.toISOString(),
            description: 'Order delivered',
            icon: 'check-circle'
        });
    }
    
    if (status === 'cancelled') {
        const cancelledTime = new Date(createdAt);
        cancelledTime.setHours(cancelledTime.getHours() + Math.floor(Math.random() * 12) + 1);
        timeline.push({
            status: 'cancelled',
            timestamp: cancelledTime.toISOString(),
            description: 'Order cancelled',
            icon: 'x-circle'
        });
    }
    
    return timeline;
}

// Simulate async data fetching
export async function fetchMockOrders(filters = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    
    let orders = generateMockOrders(120);
    
    // Apply filters
    if (filters.status && filters.status !== '') {
        orders = orders.filter(order => order.status === filters.status);
    }
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        orders = orders.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.name.toLowerCase().includes(searchTerm) ||
            order.customer.email.toLowerCase().includes(searchTerm) ||
            order.items.some(item => item.product.toLowerCase().includes(searchTerm))
        );
    }
    
    if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        orders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= start && orderDate <= end;
        });
    }
    
    // Simulate pagination
    const page = filters.page || 1;
    const limit = filters.limit || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);
    
    return {
        orders: paginatedOrders,
        total: orders.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(orders.length / limit)
    };
}

// Simulate order status update
export async function updateMockOrderStatus(orderId, newStatus) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
    
    // Simulate success/failure
    if (Math.random() > 0.1) { // 90% success rate
        return {
            success: true,
            message: `Order ${orderId} status updated to ${newStatus}`,
            orderId: orderId,
            newStatus: newStatus,
            updatedAt: new Date().toISOString()
        };
    } else {
        throw new Error('Failed to update order status. Please try again.');
    }
}

// Generate mock statistics
export function generateMockStats() {
    return {
        todayOrders: Math.floor(Math.random() * 20) + 5,
        revenue: Math.floor(Math.random() * 50000) + 25000,
        aov: Math.floor(Math.random() * 2000) + 1500,
        pending: Math.floor(Math.random() * 15) + 3,
        totalOrders: Math.floor(Math.random() * 200) + 100,
        totalCustomers: Math.floor(Math.random() * 50) + 25,
        totalProducts: Math.floor(Math.random() * 100) + 50
    };
}

// Export mock data utilities
export default {
    generateMockOrders,
    fetchMockOrders,
    updateMockOrderStatus,
    generateMockStats
};
