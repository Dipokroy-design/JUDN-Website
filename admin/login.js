// Admin Login JavaScript with Firebase Authentication
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration for JUDN project
const firebaseConfig = {
  apiKey: "AIzaSyDFv2kJw2D1jsjat2aa-CiRodNgafgtCnU",
  authDomain: "judn-e17fa.firebaseapp.com",
  projectId: "judn-e17fa",
  storageBucket: "judn-e17fa.firebasestorage.app",
  messagingSenderId: "37377539584",
  appId: "1:37377539584:web:d7c77d0f58f0a9967522e5",
  measurementId: "G-MX2L1RXYCT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin Login Class
class AdminLogin {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkExistingAuth();
  }

  setupEventListeners() {
    // Login form submission
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Password toggle
    document.getElementById("togglePassword").addEventListener("click", () => {
      this.togglePasswordVisibility();
    });

    // Input focus effects
    document.querySelectorAll("input").forEach((input) => {
      input.addEventListener("focus", () => {
        input.parentElement.classList.add(
          "ring-2",
          "ring-red-500",
          "ring-opacity-50"
        );
      });

      input.addEventListener("blur", () => {
        input.parentElement.classList.remove(
          "ring-2",
          "ring-red-500",
          "ring-opacity-50"
        );
      });
    });

    // Forgot password link
    document
      .querySelector('a[href="#forgot-password"]')
      .addEventListener("click", (e) => {
        e.preventDefault();
        this.showForgotPasswordModal();
      });
  }

  async checkExistingAuth() {
    // Listen for auth state changes
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user has admin role
        const isAdmin = await this.checkAdminRole(user.uid);
        if (isAdmin) {
          // User is authenticated and has admin role, redirect to admin panel
          window.location.href = "index.html";
        } else {
          // User doesn't have admin role, sign them out
          await auth.signOut();
          this.showError("Access denied. Admin privileges required.");
        }
      }
    });
  }

  async checkAdminRole(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.isAdmin === true || userData.role === "admin";
      }
      return false;
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
  }

  async handleLogin() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    // Validate inputs
    if (!this.validateInputs(email, password)) {
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if user has admin role
      const isAdmin = await this.checkAdminRole(user.uid);

      if (isAdmin) {
        // Store user info in localStorage
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );

        // Show success message
        this.showSuccess("Login successful! Redirecting...");

        // Redirect to admin panel after a short delay
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      } else {
        // User doesn't have admin role, sign them out
        await auth.signOut();
        this.showError("Access denied. Admin privileges required.");
      }
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please check your credentials.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address format.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
      }

      this.showError(errorMessage);
    } finally {
      this.setLoadingState(false);
    }
  }

  validateInputs(email, password) {
    // Clear previous error messages
    this.hideMessages();

    // Email validation
    if (!email) {
      this.showError("Email address is required.");
      return false;
    }

    if (!this.isValidEmail(email)) {
      this.showError("Please enter a valid email address.");
      return false;
    }

    // Password validation
    if (!password) {
      this.showError("Password is required.");
      return false;
    }

    if (password.length < 8) {
      this.showError("Password must be at least 8 characters long.");
      return false;
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("togglePassword");
    const icon = toggleBtn.querySelector("i");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  }

  setLoadingState(isLoading) {
    const loginBtn = document.getElementById("loginBtn");
    const loginBtnText = document.getElementById("loginBtnText");
    const loginBtnSpinner = document.getElementById("loginBtnSpinner");
    const loadingOverlay = document.getElementById("loadingOverlay");

    if (isLoading) {
      loginBtn.disabled = true;
      loginBtnText.classList.add("hidden");
      loginBtnSpinner.classList.remove("hidden");
      loadingOverlay.classList.remove("hidden");
    } else {
      loginBtn.disabled = false;
      loginBtnText.classList.remove("hidden");
      loginBtnSpinner.classList.add("hidden");
      loadingOverlay.classList.add("hidden");
    }
  }

  showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    const errorText = document.getElementById("errorText");

    errorText.textContent = message;
    errorMessage.classList.remove("hidden");

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideMessages();
    }, 5000);
  }

  showSuccess(message) {
    const successMessage = document.getElementById("successMessage");
    const successText = document.getElementById("successText");

    successText.textContent = message;
    successMessage.classList.remove("hidden");

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.hideMessages();
    }, 3000);
  }

  hideMessages() {
    document.getElementById("errorMessage").classList.add("hidden");
    document.getElementById("successMessage").classList.add("hidden");
  }

  showForgotPasswordModal() {
    // Create modal HTML
    const modalHTML = `
            <div id="forgotPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">Reset Password</h3>
                        <button id="closeForgotModal" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <form id="forgotPasswordForm" class="space-y-4">
                        <div>
                            <label for="resetEmail" class="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                id="resetEmail" 
                                required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="Enter your email"
                            >
                        </div>
                        <div class="flex space-x-3">
                            <button 
                                type="button" 
                                id="cancelForgot"
                                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                id="sendResetLink"
                                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Send Reset Link
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

    // Add modal to page
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Add event listeners
    document
      .getElementById("closeForgotModal")
      .addEventListener("click", () => {
        this.closeForgotPasswordModal();
      });

    document.getElementById("cancelForgot").addEventListener("click", () => {
      this.closeForgotPasswordModal();
    });

    document
      .getElementById("forgotPasswordForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleForgotPassword();
      });

    // Close modal when clicking outside
    document
      .getElementById("forgotPasswordModal")
      .addEventListener("click", (e) => {
        if (e.target.id === "forgotPasswordModal") {
          this.closeForgotPasswordModal();
        }
      });
  }

  async handleForgotPassword() {
    const email = document.getElementById("resetEmail").value.trim();

    if (!email || !this.isValidEmail(email)) {
      this.showError("Please enter a valid email address.");
      return;
    }

    const sendBtn = document.getElementById("sendResetLink");
    const originalText = sendBtn.textContent;
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";

    try {
      // Firebase forgot password
      await sendPasswordResetEmail(auth, email);
      this.showSuccess("Password reset link sent! Check your email.");
      this.closeForgotPasswordModal();
    } catch (error) {
      console.error("Forgot password error:", error);
      let errorMessage = "Failed to send reset link. Please try again.";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address format.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
      }
      this.showError(errorMessage);
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = originalText;
    }
  }

  closeForgotPasswordModal() {
    const modal = document.getElementById("forgotPasswordModal");
    if (modal) {
      modal.remove();
    }
  }

  // Demo login for testing (remove in production)
  async demoLogin() {
    const demoCredentials = {
      email: "admin@judn.com",
      password: "Admin123!",
    };

    document.getElementById("email").value = demoCredentials.email;
    document.getElementById("password").value = demoCredentials.password;

    // Auto-submit after a short delay
    setTimeout(() => {
      this.handleLogin();
    }, 500);
  }
}

// Initialize login when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.adminLogin = new AdminLogin();

  // Add demo login for development (remove in production)
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.log("Demo login available. Use admin@judn.com / Admin123!");
    // Uncomment the line below to enable auto-demo login
    // window.adminLogin.demoLogin();
  }
});
