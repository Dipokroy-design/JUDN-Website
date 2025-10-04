# JUDN Admin Panel System

A comprehensive admin panel system for the JUDN e-commerce website with role-based access control, real-time analytics, and full business management capabilities.

## 🚀 Features

### 📊 Dashboard Overview

- **Total Orders**: Real-time count of all orders
- **Total Sales**: Revenue tracking in BDT currency
- **Order Status Distribution**: Pending, Confirmed, Shipped, Delivered
- **Total Products**: Inventory management
- **Active Campaigns**: Marketing campaign tracking
- **Sales Trends Chart**: Interactive line chart with date range filters
- **Order Status Chart**: Doughnut chart showing order distribution
- **Recent Orders Table**: Latest orders with quick actions

### 👥 Role-Based Access Control

- **Admin**: Full access to all sections
- **Marketing Team**: Access to campaigns and reports only
- **Order Manager**: Access to orders, customers, and order management
- **Product Manager**: Access to products and basic reports

### 🛍️ Product Management

- Product listing with search and filtering
- Add/Edit/Delete products
- Inventory tracking
- Product categories and tags
- Image management
- SKU generation
- Stock level monitoring

### 📦 Order Management

- Order listing with status filtering
- Order status updates (Pending → Confirmed → Shipped → Delivered)
- Customer information tracking
- Order history and notes
- Export functionality
- Recent orders dashboard

### 👤 Customer Management

- Customer database with contact information
- Lead tracking and conversion
- Customer status management (Lead, Customer, Inactive, Blocked)
- Communication history
- Customer preferences and interests
- Platform source tracking

### 📢 Campaign Management

- Multi-platform campaign tracking (Facebook, Instagram, WhatsApp, TikTok, YouTube)
- Campaign goals and objectives
- Budget tracking and utilization
- Performance metrics (clicks, impressions, conversions)
- Campaign status management
- Performance logs and analytics

### 📈 Reports & Analytics

- Sales reports with date range filters
- Customer analytics and segmentation
- Campaign performance reports
- Order status distribution
- Revenue trends and forecasting

## 🏗️ Architecture

### Backend Structure

```
├── models/
│   ├── User.js           # User model with role-based permissions
│   ├── Product.js        # Product model with inventory tracking
│   ├── Order.js          # Order model with status tracking
│   ├── Customer.js       # Customer model with lead management
│   └── Campaign.js       # Campaign model with performance tracking
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── admin.js          # Admin panel routes
│   ├── products.js       # Product management routes
│   ├── orders.js         # Order management routes
│   ├── customers.js      # Customer management routes
│   └── campaigns.js      # Campaign management routes
├── middleware/
│   └── auth.js           # Authentication and authorization middleware
└── server.js             # Main Express server
```

### Frontend Structure

```
├── admin/
│   ├── index.html        # Main admin dashboard
│   ├── login.html        # Admin login page
│   ├── admin.js          # Admin panel JavaScript
│   └── login.js          # Login functionality
└── assets/               # Images, icons, and static files
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/judn-website

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Session Configuration
SESSION_SECRET=your-session-secret-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Start MongoDB (if not running)
mongod

# The application will automatically create collections and indexes
```

### 4. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Access Admin Panel

- **Admin Panel**: http://localhost:3000/admin
- **Login Page**: http://localhost:3000/admin/login.html

## 🔐 Authentication & Authorization

### User Roles & Permissions

#### Admin Role

- Full access to all sections
- User management
- System settings
- All CRUD operations

#### Marketing Team Role

- Campaign management (read/write)
- Reports and analytics (read)
- No access to products, orders, or financial data

#### Order Manager Role

- Order management (read/write)
- Customer management (read/write)
- Order status updates
- No access to products or campaigns

#### Product Manager Role

- Product management (read/write)
- Basic reports (read)
- No access to orders, customers, or campaigns

### Default Admin Account

For development, you can create an admin account using the registration endpoint:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@judn.com",
    "password": "Admin123!",
    "phone": "01712345678",
    "role": "admin"
  }'
```

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Admin Dashboard

- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/sales-trends` - Sales trends data

### Products

- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Orders

- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/recent` - Get recent orders
- `PUT /api/admin/orders/:id/status` - Update order status

### Customers

- `GET /api/admin/customers` - Get all customers
- `POST /api/admin/customers` - Create customer

### Campaigns

- `GET /api/admin/campaigns` - Get all campaigns
- `POST /api/admin/campaigns` - Create campaign
- `PUT /api/admin/campaigns/:id` - Update campaign
- `PUT /api/admin/campaigns/:id/metrics` - Update campaign metrics

## 🎨 UI/UX Features

### Modern Design

- Clean, modern interface with Tailwind CSS
- Responsive design for all devices
- Dark/light mode support
- Interactive charts with Chart.js
- Smooth animations and transitions

### User Experience

- Intuitive navigation with sidebar
- Real-time notifications
- Loading states and error handling
- Form validation and feedback
- Search and filtering capabilities
- Export functionality

### Accessibility

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Focus management
- ARIA labels and descriptions

## 🔧 Configuration

### Customization Options

#### Branding

- Update logo and colors in `admin/index.html`
- Modify CSS variables in `admin/admin.js`
- Customize email templates

#### Permissions

- Modify role permissions in `models/User.js`
- Update middleware in `middleware/auth.js`
- Add new roles as needed

#### Dashboard Widgets

- Add new dashboard cards in `admin/index.html`
- Create new chart components
- Customize data visualization

## 🚀 Deployment

### Production Setup

1. **Environment Variables**

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-jwt-secret
SESSION_SECRET=your-production-session-secret
FRONTEND_URL=https://your-domain.com
```

2. **Security Considerations**

- Use HTTPS in production
- Implement rate limiting
- Set up proper CORS configuration
- Use environment variables for secrets
- Enable helmet security middleware

3. **Database Optimization**

- Set up database indexes
- Configure connection pooling
- Implement data backup strategies
- Monitor database performance

4. **Monitoring & Logging**

- Set up application monitoring
- Implement error logging
- Configure performance metrics
- Set up alerting systems

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Authentication Issues**

   - Clear browser localStorage
   - Check JWT secret configuration
   - Verify user credentials

3. **Permission Errors**

   - Check user role and permissions
   - Verify middleware configuration
   - Review route access controls

4. **Chart Loading Issues**
   - Check Chart.js CDN availability
   - Verify data format
   - Check browser console for errors

## 📝 Development

### Adding New Features

1. **Backend**

   - Create new model in `models/`
   - Add routes in `routes/`
   - Update middleware if needed
   - Add validation and error handling

2. **Frontend**

   - Add new section in `admin/index.html`
   - Create JavaScript functionality
   - Update navigation and routing
   - Add styling and animations

3. **Testing**
   - Test API endpoints
   - Verify frontend functionality
   - Check responsive design
   - Test user permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**JUDN Admin Panel** - Empowering your e-commerce business with comprehensive management tools.
