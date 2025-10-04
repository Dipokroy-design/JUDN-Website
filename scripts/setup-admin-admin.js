const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = {
  // We'll use the default credentials from the environment
};

// Initialize the app
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "judn-e17fa",
});

const auth = admin.auth();
const db = admin.firestore();

// Admin user details
const adminUsers = [
  {
    email: "dipokrayakil7777@gmail.com",
    password: "#DipokJUDNPass1100",
    displayName: "Dipok Ray Admin 1",
    role: "admin",
  },
  {
    email: "dipokray1100@gmail.com",
    password: "#DipokJUDNPass1100",
    displayName: "Dipok Ray Admin 2",
    role: "admin",
  },
];

async function createAdminUser(userData) {
  try {
    console.log(`Creating admin user: ${userData.email}`);

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      emailVerified: true,
    });

    console.log(`✅ User created successfully: ${userRecord.uid}`);

    // Set custom claims for admin role
    await auth.setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: "admin",
    });

    console.log(`✅ Admin claims set for: ${userData.email}`);

    // Create user document in Firestore with admin role
    await db.collection("users").doc(userRecord.uid).set({
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      uid: userRecord.uid,
    });

    console.log(`✅ Admin role assigned to: ${userData.email}`);
    return userRecord;
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      console.log(
        `⚠️ User ${userData.email} already exists, updating admin status...`
      );

      try {
        // Get the existing user
        const userRecord = await auth.getUserByEmail(userData.email);

        // Set custom claims for admin role
        await auth.setCustomUserClaims(userRecord.uid, {
          admin: true,
          role: "admin",
        });

        console.log(
          `✅ Admin claims updated for existing user: ${userData.email}`
        );

        // Update user document to ensure admin role
        await db.collection("users").doc(userRecord.uid).set(
          {
            email: userData.email,
            displayName: userData.displayName,
            role: userData.role,
            isAdmin: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            uid: userRecord.uid,
          },
          { merge: true }
        );

        console.log(
          `✅ Admin role updated for existing user: ${userData.email}`
        );
        return userRecord;
      } catch (updateError) {
        console.error(
          `❌ Error updating existing user: ${updateError.message}`
        );
        return null;
      }
    } else {
      console.error(`❌ Error creating user ${userData.email}:`, error.message);
      return null;
    }
  }
}

async function setupAdminUsers() {
  console.log("🚀 Setting up JUDN Admin Users...\n");

  for (const userData of adminUsers) {
    await createAdminUser(userData);
    console.log("---");
  }

  console.log("\n✅ Admin user setup complete!");
  console.log("\n📧 Admin Emails:");
  adminUsers.forEach((user) => {
    console.log(`   • ${user.email}`);
  });
  console.log("\n🔑 Password: #DipokJUDNPass1100");
  console.log("\n🌐 Login at: https://judn-e17fa.web.app/admin");
}

// Run the setup
setupAdminUsers().catch(console.error);
