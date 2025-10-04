// JUDN Admin Panel - Order Details Modal Module
import { renderStatusBadge, showToast } from "./ui.js";
import { updateOrderStatus } from "./firebase-hooks.js";

class OrderModal {
  constructor() {
    this.isOpen = false;
    this.currentOrder = null;
    this.focusableElements = [];
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;

    this.init();
  }

  init() {
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Listen for order view requests
    window.JUDN.on("order:view", (orderId) => {
      this.openOrderModal(orderId);
    });

    // Listen for modal close requests
    window.JUDN.on("modal:close", () => {
      this.closeModal();
    });

    // Listen for status updates
    window.JUDN.on("order:statusUpdated", (data) => {
      if (this.currentOrder && this.currentOrder.id === data.orderId) {
        this.currentOrder.status = data.newStatus;
        this.updateModalContent();
      }
    });
  }

  async openOrderModal(orderId) {
    try {
      // Find the order in the current table data
      const orders = window.tableManager ? window.tableManager.getOrders() : [];
      const order = orders.find((o) => o.id === orderId);

      if (!order) {
        showToast("Order not found", "error");
        return;
      }

      this.currentOrder = order;
      this.showModal();
      this.renderModalContent();
      this.setupFocusTrap();
    } catch (error) {
      console.error("Error opening order modal:", error);
      showToast("Failed to open order details", "error");
    }
  }

  showModal() {
    const modal = document.getElementById("orderModal");
    if (modal) {
      modal.classList.remove("hidden");
      this.isOpen = true;

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Focus first focusable element
      setTimeout(() => {
        this.firstFocusableElement?.focus();
      }, 100);
    }
  }

  closeModal() {
    const modal = document.getElementById("orderModal");
    if (modal) {
      modal.classList.add("hidden");
      this.isOpen = false;

      // Restore body scroll
      document.body.style.overflow = "";

      // Return focus to the element that opened the modal
      if (this.previousActiveElement) {
        this.previousActiveElement.focus();
      }
    }
  }

  renderModalContent() {
    const modal = document.getElementById("orderModal");
    if (!modal || !this.currentOrder) return;

    const order = this.currentOrder;

    const modalContent = `
            <div class="flex flex-col h-full">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 id="modal-title" class="text-xl font-semibold text-text">Order Details</h2>
                        <p class="text-sm text-textMuted mt-1">${order.id}</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        ${renderStatusBadge(order.status)}
                        <button onclick="window.modalManager.closeModal()" 
                                class="p-2 text-textMuted hover:text-text hover:bg-muted rounded-lg transition-colors"
                                aria-label="Close modal">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Modal Body -->
                <div class="flex-1 overflow-y-auto p-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Order Summary -->
                        <div class="space-y-6">
                            <div class="bg-muted rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-text mb-4">Order Summary</h3>
                                <div class="space-y-3">
                                    <div class="flex justify-between">
                                        <span class="text-textMuted">Order Date:</span>
                                        <span class="text-text">${window.JUDN.formatDate(
                                          order.createdAt
                                        )}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-textMuted">Payment Method:</span>
                                        <span class="text-text">${
                                          order.paymentMethod
                                        }</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-textMuted">Tracking Number:</span>
                                        <span class="text-text">${
                                          order.trackingNumber ||
                                          "Not available"
                                        }</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-textMuted">Notes:</span>
                                        <span class="text-text">${
                                          order.notes || "No notes"
                                        }</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Customer Information -->
                            <div class="bg-muted rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-text mb-4">Customer Information</h3>
                                <div class="space-y-3">
                                    <div>
                                        <span class="text-textMuted">Name:</span>
                                        <div class="text-text font-medium">${
                                          order.customer.name
                                        }</div>
                                    </div>
                                    <div>
                                        <span class="text-textMuted">Email:</span>
                                        <div class="text-text">${
                                          order.customer.email
                                        }</div>
                                    </div>
                                    <div>
                                        <span class="text-textMuted">Phone:</span>
                                        <div class="text-text">${
                                          order.customer.phone
                                        }</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Shipping Address -->
                            <div class="bg-muted rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-text mb-4">Shipping Address</h3>
                                <div class="text-text">
                                    <div>${order.customer.address.street}</div>
                                    <div>${order.customer.address.city}, ${
      order.customer.address.postalCode
    }</div>
                                    <div>${order.customer.address.country}</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Order Items & Actions -->
                        <div class="space-y-6">
                            <!-- Order Items -->
                            <div class="bg-muted rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-text mb-4">Order Items</h3>
                                <div class="space-y-3">
                                    ${order.items
                                      .map(
                                        (item) => `
                                        <div class="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
                                            <div>
                                                <div class="text-text font-medium">${
                                                  item.product
                                                }</div>
                                                <div class="text-sm text-textMuted">${
                                                  item.category
                                                }</div>
                                            </div>
                                            <div class="text-right">
                                                <div class="text-text">${
                                                  item.quantity
                                                } × ${window.JUDN.formatCurrency(
                                          item.price
                                        )}</div>
                                                <div class="text-sm text-textMuted">${window.JUDN.formatCurrency(
                                                  item.subtotal
                                                )}</div>
                                            </div>
                                        </div>
                                    `
                                      )
                                      .join("")}
                                </div>
                            </div>
                            
                            <!-- Order Totals -->
                            <div class="bg-muted rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-text mb-4">Order Totals</h3>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-textMuted">Subtotal:</span>
                                        <span class="text-text">${window.JUDN.formatCurrency(
                                          order.subtotal
                                        )}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-textMuted">Shipping:</span>
                                        <span class="text-text">${window.JUDN.formatCurrency(
                                          order.shipping
                                        )}</span>
                                    </div>
                                    <div class="flex justify-between text-lg font-semibold border-t border-border pt-2">
                                        <span class="text-text">Total:</span>
                                        <span class="text-primary">${window.JUDN.formatCurrency(
                                          order.total
                                        )}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Order Actions -->
                            <div class="bg-muted rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-text mb-4">Actions</h3>
                                <div class="space-y-3">
                                    <button onclick="window.modalManager.updateOrderStatus('${
                                      order.id
                                    }')" 
                                            class="w-full px-4 py-2 bg-primary text-bg rounded-lg hover:bg-primaryHover transition-colors">
                                        Update Status
                                    </button>
                                    <button onclick="window.JUDN.whatsapp(${JSON.stringify(
                                      order
                                    ).replace(/"/g, "&quot;")})" 
                                            class="w-full px-4 py-2 bg-success text-white rounded-lg hover:bg-success/80 transition-colors">
                                        WhatsApp Customer
                                    </button>
                                    <button onclick="window.modalManager.printInvoice('${
                                      order.id
                                    }')" 
                                            class="w-full px-4 py-2 bg-muted text-text rounded-lg hover:bg-mutedAlt transition-colors">
                                        Print Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Order Timeline -->
                    <div class="mt-8">
                        <h3 class="text-lg font-semibold text-text mb-4">Order Timeline</h3>
                        <div class="bg-muted rounded-lg p-4">
                            <div class="space-y-4">
                                ${order.timeline
                                  .map(
                                    (event, index) => `
                                    <div class="flex items-start space-x-4">
                                        <div class="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <i data-lucide="${
                                              event.icon
                                            }" class="w-4 h-4 text-primary"></i>
                                        </div>
                                        <div class="flex-1">
                                            <div class="text-text font-medium">${
                                              event.description
                                            }</div>
                                            <div class="text-sm text-textMuted">${window.JUDN.formatDate(
                                              event.timestamp
                                            )}</div>
                                        </div>
                                        ${
                                          index < order.timeline.length - 1
                                            ? '<div class="w-px h-8 bg-border ml-4"></div>'
                                            : ""
                                        }
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    const modalBody = modal.querySelector(".bg-surface");
    if (modalBody) {
      modalBody.innerHTML = modalContent;
    }

    // Re-initialize icons
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  updateModalContent() {
    if (this.isOpen && this.currentOrder) {
      this.renderModalContent();
    }
  }

  setupFocusTrap() {
    const modal = document.getElementById("orderModal");
    if (!modal) return;

    // Get all focusable elements
    this.focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (this.focusableElements.length === 0) return;

    this.firstFocusableElement = this.focusableElements[0];
    this.lastFocusableElement =
      this.focusableElements[this.focusableElements.length - 1];

    // Store the element that had focus before opening modal
    this.previousActiveElement = document.activeElement;

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === this.firstFocusableElement) {
            e.preventDefault();
            this.lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === this.lastFocusableElement) {
            e.preventDefault();
            this.firstFocusableElement.focus();
          }
        }
      } else if (e.key === "Escape") {
        this.closeModal();
      }
    };

    modal.addEventListener("keydown", handleKeyDown);

    // Store the handler for cleanup
    this.keydownHandler = handleKeyDown;
  }

  async updateOrderStatus(orderId) {
    if (!this.currentOrder || this.currentOrder.id !== orderId) return;

    try {
      // Create status selection dropdown
      const statuses = [
        { value: "new", label: "New" },
        { value: "processing", label: "Processing" },
        { value: "shipped", label: "Shipped" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ];

      const currentStatus = this.currentOrder.status;
      const availableStatuses = statuses.filter(
        (s) => s.value !== currentStatus
      );

      if (availableStatuses.length === 0) {
        showToast("No status changes available", "info");
        return;
      }

      // Show status selection
      const status = await this.showStatusSelection(availableStatuses);
      if (!status) return;

      // Update the order status
      const result = await updateOrderStatus(orderId, status);

      if (result.success) {
        this.currentOrder.status = status;
        this.currentOrder.updatedAt = result.updatedAt;

        // Add to timeline
        this.currentOrder.timeline.push({
          status: status,
          timestamp: result.updatedAt,
          description: `Status updated to ${status}`,
          icon: this.getStatusIcon(status),
        });

        this.updateModalContent();
        showToast(result.message, "success");

        // Emit status update event
        window.JUDN.emit("order:statusUpdated", { orderId, newStatus: status });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      showToast("Failed to update order status", "error");
    }
  }

  async showStatusSelection(statuses) {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
      modal.innerHTML = `
                <div class="bg-surface border border-border rounded-lg p-6 w-96 max-w-md mx-4">
                    <h3 class="text-lg font-semibold text-text mb-4">Select New Status</h3>
                    <div class="space-y-2">
                        ${statuses
                          .map(
                            (status) => `
                            <button class="w-full text-left px-4 py-3 text-text hover:bg-muted rounded-lg transition-colors"
                                    data-status="${status.value}">
                                ${status.label}
                            </button>
                        `
                          )
                          .join("")}
                    </div>
                    <div class="mt-4 flex justify-end">
                        <button class="px-4 py-2 text-textMuted hover:text-text transition-colors"
                                onclick="this.closest('.fixed').remove()">
                            Cancel
                        </button>
                    </div>
                </div>
            `;

      // Add event listeners
      modal.querySelectorAll("[data-status]").forEach((button) => {
        button.addEventListener("click", () => {
          const status = button.dataset.status;
          modal.remove();
          resolve(status);
        });
      });

      // Close on backdrop click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.remove();
          resolve(null);
        }
      });

      document.body.appendChild(modal);
    });
  }

  getStatusIcon(status) {
    const icons = {
      new: "circle",
      processing: "clock",
      shipped: "truck",
      completed: "check-circle",
      cancelled: "x-circle",
    };
    return icons[status] || "circle";
  }

  printInvoice(orderId) {
    // This would implement actual invoice printing
    showToast("Print functionality coming soon", "info");
  }

  // Public methods
  openModal(orderId) {
    this.openOrderModal(orderId);
  }

  closeModal() {
    this.hideModal();
  }
}

// Initialize modal manager
export function initializeModal() {
  window.modalManager = new OrderModal();
  return window.modalManager;
}

// Export utility functions
export function openOrderModal(orderId) {
  if (window.modalManager) {
    window.modalManager.openModal(orderId);
  }
}

export function closeOrderModal() {
  if (window.modalManager) {
    window.modalManager.closeModal();
  }
}

// Default export
export default {
  initializeModal,
  openOrderModal,
  closeOrderModal,
};
