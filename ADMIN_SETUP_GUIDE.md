# 🔐 JUDN Admin User Setup Guide

## 📋 **Admin User Details**

| Email                        | Password             | Role  |
| ---------------------------- | -------------------- | ----- |
| `dipokrayakil7777@gmail.com` | `#DipokJUDNPass1100` | Admin |
| `dipokray1100@gmail.com`     | `#DipokJUDNPass1100` | Admin |

## 🚀 **Step-by-Step Setup**

### **Option 1: Firebase Console (Recommended)**

1. **Go to Firebase Console**

   - Visit: https://console.firebase.google.com/
   - Select your project: `judn-e17fa`

2. **Create Admin Users**

   - Go to **Authentication** → **Users**
   - Click **Add User**
   - Enter email: `dipokrayakil7777@gmail.com`
   - Enter password: `#DipokJUDNPass1100`
   - Click **Add User**
   - Repeat for `dipokray1100@gmail.com`

3. **Set Admin Claims (Optional but Recommended)**
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Set admin claims:
   ```bash
   firebase auth:export users.json
   # Edit users.json to add admin claims
   firebase auth:import users.json
   ```

### **Option 2: Manual Firestore Setup**

1. **Go to Firestore Database**

   - In Firebase Console, go to **Firestore Database**

2. **Create Users Collection**
   - Create collection: `users`
   - For each admin user, create a document with their UID containing:
   ```json
   {
     "email": "dipokrayakil7777@gmail.com",
     "displayName": "Dipok Ray Admin 1",
     "role": "admin",
     "isAdmin": true,
     "createdAt": "2024-01-01T00:00:00.000Z",
     "uid": "USER_UID_FROM_AUTH"
   }
   ```

## 🔑 **Login Information**

- **Admin Panel URL**: https://judn-e17fa.web.app/admin
- **Email**: Use either of the admin emails above
- **Password**: `#DipokJUDNPass1100`

## ✅ **Verification Steps**

1. **Test Login**

   - Go to https://judn-e17fa.web.app/admin
   - Try logging in with admin credentials
   - Should redirect to admin dashboard

2. **Check Firestore**

   - Verify user documents exist in `users` collection
   - Confirm `isAdmin: true` and `role: "admin"`

3. **Test Admin Access**
   - Login should work with both admin accounts
   - Non-admin users should be denied access

## 🚨 **Security Notes**

- **Change passwords** after first login
- **Enable 2FA** for additional security
- **Monitor login attempts** in Firebase Console
- **Regular security audits** recommended

## 🆘 **Troubleshooting**

- **"Access denied" error**: Check if user document has `isAdmin: true`
- **"User not found"**: Verify user exists in Firebase Authentication
- **"Invalid password"**: Check password spelling and special characters

## 📞 **Support**

If you encounter issues:

1. Check Firebase Console for error logs
2. Verify Firestore rules allow admin access
3. Ensure Firebase configuration is correct in `common/firebase-init.js`
