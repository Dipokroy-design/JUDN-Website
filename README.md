# JUDN Website - Firebase-Powered E-commerce Platform

A modern, responsive e-commerce website built with vanilla JavaScript, Firebase, and Tailwind CSS. Features include product catalog, shopping cart, checkout system, and admin panel with real-time order management.

## 🚀 Features

- **Product Catalog**: Browse and search products with responsive design
- **Shopping Cart**: Add/remove items with localStorage persistence
- **Checkout System**: Customer information collection and order submission
- **Firebase Integration**: Real-time database with Firestore
- **Admin Panel**: Secure admin interface with Firebase Authentication
- **Order Management**: Real-time order tracking and status updates
- **WhatsApp Integration**: Direct customer communication via WhatsApp
- **CSV Export**: Export orders data for analysis
- **Mobile-First Design**: Responsive design optimized for all devices

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Deployment**: GitHub Pages
- **Authentication**: GitHub OAuth + Email/Password
- **Database**: Cloud Firestore

## 📋 Prerequisites

- Node.js (v14 or higher)
- Firebase account
- GitHub account
- Modern web browser

## 🔧 Setup Instructions

### 1. Firebase Project Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" or "Add project"
   - Enter project name (e.g., "judn-website")
   - Choose whether to enable Google Analytics (optional)
   - Click "Create project"

2. **Enable Services**:
   - **Firestore Database**: Click "Create database" → Start in test mode
   - **Authentication**: Click "Get started" → Enable GitHub provider and Email/Password

3. **Configure GitHub OAuth**:
   - In Authentication → Sign-in method → GitHub
   - Click "Enable" and add your GitHub OAuth app credentials
   - For GitHub OAuth app setup, see [GitHub OAuth Guide](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

4. **Get Firebase Config**:
   - Go to Project Settings → General → Your apps
   - Click "Add app" → Web app
   - Register app and copy the `firebaseConfig` object

### 2. Project Configuration

1. **Update Firebase Config**:
   ```bash
   # Edit common/firebase-init.js
   # Replace the placeholder firebaseConfig with your actual config
   ```

2. **Set Merchant Phone Number**:
   ```bash
   # Edit checkout.js and admin/admin.js
   # Replace MERCHANT_PHONE with your actual phone number
   const MERCHANT_PHONE = '+8801234567890'; // Your actual number
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Build CSS**:
   ```bash
   npm run build
   ```

### 3. Admin Setup

1. **Create Admin Users**:
   - Sign in to your admin panel using GitHub or email
   - Note your UID from Firebase Authentication
   - In Firestore, create a collection called `admins`
   - Add a document with your UID as the document ID
   - Set the document content to: `{ role: "admin", createdAt: serverTimestamp() }`

2. **Admin Access Control**:
   - Only users with documents in the `admins` collection can access the admin panel
   - This provides an additional security layer beyond Firebase Auth

### 4. Deploy to GitHub Pages

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial Firebase integration"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository → Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Click "Save"

3. **Update Firebase Hosting** (Optional):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 🔒 Security Features

- **Firestore Rules**: Secure database access with role-based permissions
- **Admin Authentication**: GitHub OAuth + Email/Password with admin verification
- **Input Validation**: Client and server-side validation for all forms
- **CORS Protection**: Configured for secure cross-origin requests
- **Rate Limiting**: Built-in protection against abuse

## 📱 Usage

### Customer Flow
1. Browse products on the main page
2. Add items to cart
3. Proceed to checkout
4. Fill customer information
5. Submit order (saved to Firestore)
6. Receive order confirmation with WhatsApp contact option

### Admin Flow
1. Sign in with GitHub or email
2. View real-time orders dashboard
3. Update order statuses
4. Export orders to CSV
5. Contact customers via WhatsApp
6. Manage products and campaigns

## 🗂️ Project Structure

```
JUDN-Website/
├── common/
│   └── firebase-init.js      # Firebase configuration
├── admin/
│   ├── index.html            # Admin panel interface
│   ├── admin.js              # Admin functionality
│   ├── login.html            # Login page
│   └── login.js              # Login logic
├── assets/
│   ├── styles.css            # Additional CSS styles
│   └── ...                   # Images and assets
├── scripts/
│   └── utils.js              # Utility functions
├── checkout.html              # Checkout page
├── checkout.js                # Checkout logic
├── firestore.rules            # Database security rules
├── index.html                 # Main product page
├── cart.html                  # Shopping cart page
└── README.md                  # This file
```

## 🔧 Configuration Files

### Firebase Config (`common/firebase-init.js`)
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Firestore Rules (`firestore.rules`)
- Secure access control for all collections
- Admin-only access for sensitive operations
- Anonymous order creation with validation

## 🚨 Important Notes

- **Never commit API keys** to version control
- **Update merchant phone number** in checkout.js and admin.js
- **Set up admin users** in Firestore before accessing admin panel
- **Test thoroughly** in development before production deployment
- **Monitor Firebase usage** to stay within free tier limits

## 🐛 Troubleshooting

### Common Issues

1. **Firebase not initialized**:
   - Check browser console for errors
   - Verify firebaseConfig in firebase-init.js
   - Ensure Firebase services are enabled

2. **Admin access denied**:
   - Verify admin document exists in Firestore
   - Check Firebase Authentication status
   - Ensure GitHub OAuth is properly configured

3. **Orders not saving**:
   - Check Firestore rules
   - Verify database permissions
   - Check browser console for errors

4. **WhatsApp links not working**:
   - Verify merchant phone number format
   - Ensure phone number includes country code

### Debug Mode

Enable debug logging in Firebase:
```javascript
// Add to firebase-init.js
if (location.hostname === 'localhost') {
  console.log('Firebase debug mode enabled');
}
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review Firebase documentation
3. Check browser console for error messages
4. Verify all configuration steps are completed

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🔄 Updates

- **v1.0.0**: Initial Firebase integration
- **v1.1.0**: Admin panel with real-time orders
- **v1.2.0**: WhatsApp integration and CSV export
- **v1.3.0**: Enhanced security and validation

---

**Built with ❤️ for JUDN Team**
