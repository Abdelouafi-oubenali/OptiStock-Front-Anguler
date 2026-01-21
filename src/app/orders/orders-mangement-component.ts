import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalseOrder, SalesOrderLine } from './order-models';
import { ProductService } from '../services/product-service';
import { UserService } from '../services/user-service';
import { Product } from '../product/product';
import { User } from '../users/user.model';

@Component({
  selector: 'app-orders-mangement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-mangement-component.html',
  styleUrl: './orders-mangement-component.css'
})
export class OrdersManagementComponent implements OnInit {

  @Input() salseOrder: SalseOrder[] = [];
  @Input() salesOrdersLine: SalesOrderLine[] = [];

  // Propriétés pour le composant
  currentView = 'list';
  searchQuery = '';
  isLoading = false;
  selectedOrder: SalseOrder | null = null;
  orderNotes: string = '';

  // Propriétés pour les produits
  products: Product[] = [];
  isLoadingProducts = false;

  // Propriétés pour les utilisateurs
  users: User[] = [];
  isLoadingUsers = false;

  // Pour la pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('OrdersManagementComponent initialized');
    console.log('Orders:', this.salseOrder);
    console.log('Order lines:', this.salesOrdersLine);
    
    // Charger les produits et utilisateurs
    this.loadProducts();
    this.loadUsers();
  }

  // Charger les produits depuis le service
  loadProducts(): void {
    this.isLoadingProducts = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log('Products loaded:', products.length);
        this.isLoadingProducts = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoadingProducts = false;
      }
    });
  }

  // Charger les utilisateurs depuis le service
  loadUsers(): void {
    this.isLoadingUsers = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Users loaded:', users.length);
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoadingUsers = false;
      }
    });
  }

  // Méthodes pour gérer les commandes
  get filteredOrders(): SalseOrder[] {
    if (!this.searchQuery) return this.salseOrder;

    const query = this.searchQuery.toLowerCase();
    return this.salseOrder.filter(order => {
      const userName = this.getUserName(order.user_id).toLowerCase();
      const productNames = this.getOrderLines(order.id || '')
        .map(line => this.getProductName(line.product_id || ''))
        .join(' ')
        .toLowerCase();
      
      return (
        order.id?.toLowerCase().includes(query) ||
        order.user_id.toLowerCase().includes(query) ||
        userName.includes(query) ||
        order.orderStatus.toLowerCase().includes(query) ||
        productNames.includes(query)
      );
    });
  }

  get paginatedOrders(): SalseOrder[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  // Obtenir les lignes d'une commande spécifique
  getOrderLines(orderId: string): SalesOrderLine[] {
    return this.salesOrdersLine.filter(line => line.sales_order_id === orderId);
  }

  // Calculer le total d'une commande
  getOrderTotal(orderId: string): number {
    const lines = this.getOrderLines(orderId);
    return lines.reduce((total, line) => {
      return total + (line.quantity * line.unitPrice);
    }, 0);
  }

  // Méthodes pour les actions principales
  createOrder(): void {
    if (this.users.length === 0) {
      alert('Please wait for users to load or add a user first');
      return;
    }

    // Afficher un selecteur d'utilisateur
    const userOptions = this.users.map(u => `${u.id} - ${u.firstName} ${u.lastName} (${u.email})`).join('\n');
    const userSelection = prompt(`Select user by ID:\n\n${userOptions}\n\nEnter User ID:`);
    
    if (!userSelection) return;

    const userId = userSelection.split(' - ')[0];
    const selectedUser = this.users.find(u => u.id === userId);
    
    if (!selectedUser) {
      alert('User not found!');
      return;
    }

    const newOrder: SalseOrder = {
      id: `ORD${Date.now()}`,
      user_id: userId,
      orderStatus: 'pending'
    };

    this.salseOrder = [newOrder, ...this.salseOrder];
    console.log('Created new order:', newOrder);
    alert(`New order created for ${selectedUser.firstName} ${selectedUser.lastName}`);
  }

  editOrder(order: SalseOrder): void {
    console.log('Edit order:', order);
    const statusOptions = ['pending', 'processing', 'completed', 'cancelled'];
    const status = prompt(`Current status: ${order.orderStatus}\n\nEnter new status (${statusOptions.join(', ')}):`, order.orderStatus);
    
    if (status && statusOptions.includes(status.toLowerCase())) {
      order.orderStatus = status;
    } else if (status) {
      alert(`Invalid status. Please use one of: ${statusOptions.join(', ')}`);
    }
  }

  deleteOrder(order: SalseOrder): void {
    console.log('Delete order:', order);
    const userName = this.getUserName(order.user_id);
    const orderLines = this.getOrderLines(order.id || '');
    const itemsCount = orderLines.length;
    const orderTotal = this.getOrderTotal(order.id || '');
    
    const confirmationMessage = `
      Delete Order ${order.id}?
      --------------------------
      Customer: ${userName}
      Items: ${itemsCount}
      Total: ${orderTotal} DH
      Status: ${order.orderStatus}
      
      This action cannot be undone!
    `;
    
    if (confirm(confirmationMessage)) {
      // Supprimer aussi les lignes de commande associées
      this.salesOrdersLine = this.salesOrdersLine.filter(
        line => line.sales_order_id !== order.id
      );
      
      this.salseOrder = this.salseOrder.filter(o => o.id !== order.id);
      console.log('Order deleted:', order);
      alert(`Order ${order.id} has been deleted.`);
    }
  }

  viewOrderDetails(order: SalseOrder): void {
    console.log('View order details:', order);
    this.selectedOrder = order;
    this.currentView = 'details';
    this.orderNotes = '';
  }

  goBackToList(): void {
    this.selectedOrder = null;
    this.currentView = 'list';
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
  }

  // Méthodes utilitaires pour l'affichage
  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : `User ${userId}`;
  }

  // Récupérer les détails complets de l'utilisateur
  getUserDetails(userId: string): User | undefined {
    return this.users.find(u => u.id === userId);
  }

  // Récupérer le nom du produit depuis la liste des produits
  getProductName(productId: string): string {
    const product = this.products.find(p => p.id === productId);
    return product ? `${product.name} (${product.sku || 'N/A'})` : `Product ${productId}`;
  }

  // Récupérer les détails complets du produit
  getProductDetails(productId: string): Product | undefined {
    return this.products.find(p => p.id === productId);
  }

  // Compter les commandes par statut
  getOrderCountByStatus(status: string): number {
    return this.salseOrder.filter(o => o.orderStatus === status).length;
  }

  // Calculer le total des unités dans une commande
  getTotalUnitsInOrder(orderId: string): number {
    return this.getOrderLines(orderId).reduce((sum, line) => sum + line.quantity, 0);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Méthodes pour les order lines
  addOrderLine(orderId: string): void {
    if (this.products.length === 0) {
      alert('Please wait for products to load or add a product first');
      return;
    }

    // Afficher un sélecteur de produits avec plus d'informations
    const productOptions = this.products.map(p => 
      `${p.id} - ${p.name} (Ref: ${p.sku || 'N/A'}) - ${p.price} DH - Stock: ${p.stock || 'N/A'}`
    ).join('\n');
    
    const productSelection = prompt(
      `Select product by ID:\n\n${productOptions}\n\nEnter Product ID:`
    );
    
    if (!productSelection) return;

    const productId = productSelection.split(' - ')[0];
    const selectedProduct = this.products.find(p => p.id === productId);
    
    if (!selectedProduct) {
      alert('Product not found!');
      return;
    }

    // Vérifier le stock si disponible
    if (selectedProduct.stock !== undefined && selectedProduct.stock <= 0) {
      alert(`Product ${selectedProduct.name} is out of stock!`);
      return;
    }

    const quantity = prompt(
      `Enter quantity for ${selectedProduct.name}:\nAvailable stock: ${selectedProduct.stock || 'N/A'}`,
      '1'
    );
    
    if (quantity) {
      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        alert('Invalid quantity!');
        return;
      }

      // Vérifier le stock
      if (selectedProduct.stock !== undefined && parsedQuantity > selectedProduct.stock) {
        alert(`Not enough stock! Available: ${selectedProduct.stock}`);
        return;
      }

      const newLine: SalesOrderLine = {
        product_id: productId,
        sales_order_id: orderId,
        quantity: parsedQuantity,
        unitPrice: selectedProduct.price
      };

      this.salesOrdersLine.push(newLine);
      console.log('Added new order line:', newLine);
      alert(`Added ${parsedQuantity} x ${selectedProduct.name} to order`);
    }
  }

  // Méthode améliorée pour éditer une ligne de commande
  editOrderLine(line: SalesOrderLine): void {
    const productId = line.product_id || '';
    const product = productId ? this.getProductDetails(productId) : null;
    const currentProductInfo = product ? 
      `${product.name} (Ref: ${product.sku || 'N/A'}) - Stock: ${product.stock || 'N/A'}` : 
      (line.product_id || 'Unknown');
    
    const newQuantity = prompt(
      `Current quantity: ${line.quantity}\nProduct: ${currentProductInfo}\n\nEnter new quantity:`,
      line.quantity.toString()
    );
    
    if (newQuantity) {
      const parsedQuantity = parseInt(newQuantity);
      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        alert('Invalid quantity!');
        return;
      }
      
      // Vérifier le stock si disponible
      if (product?.stock !== undefined && parsedQuantity > product.stock) {
        alert(`Not enough stock! Available: ${product.stock}`);
        return;
      }
      
      line.quantity = parsedQuantity;
    }
  }

  removeOrderLine(line: SalesOrderLine): void {
    const productId = line.product_id || '';
    const productName = productId ? this.getProductName(productId) : 'Unknown';
    if (confirm(`Remove ${line.quantity} x ${productName} from order?`)) {
      const index = this.salesOrdersLine.findIndex(l => 
        l.sales_order_id === line.sales_order_id && 
        l.product_id === line.product_id
      );
      
      if (index > -1) {
        this.salesOrdersLine.splice(index, 1);
        console.log('Removed order line:', line);
      }
    }
  }

  updateQuantity(line: SalesOrderLine, newQuantity: number): void {
    if (newQuantity >= 0) {
      const productId = line.product_id || '';
      const product = productId ? this.getProductDetails(productId) : null;
      
      // Vérifier le stock si disponible
      if (product?.stock !== undefined && newQuantity > product.stock) {
        alert(`Not enough stock! Available: ${product.stock}`);
        return;
      }
      
      line.quantity = newQuantity;
    }
  }

  // Méthodes pour les calculs
  calculateSubtotal(orderId: string): number {
    return this.getOrderTotal(orderId);
  }

  calculateTax(orderId: string): number {
    return this.getOrderTotal(orderId) * 0.20;
  }

  // Méthodes pour les actions supplémentaires
  changeOrderStatus(order: SalseOrder): void {
    const statusOptions = ['pending', 'processing', 'completed', 'cancelled'];
    const currentStatus = order.orderStatus;
    const newStatus = prompt(
      `Current status: ${currentStatus}\n\nEnter new status (${statusOptions.join(', ')}):`,
      currentStatus
    );
    
    if (newStatus && statusOptions.includes(newStatus.toLowerCase())) {
      order.orderStatus = newStatus;
      console.log(`Order ${order.id} status changed to: ${newStatus}`);
    } else if (newStatus) {
      alert(`Invalid status. Please use one of: ${statusOptions.join(', ')}`);
    }
  }

  sendInvoice(order: SalseOrder): void {
    const userDetails = this.getUserDetails(order.user_id);
    const customerName = this.getUserName(order.user_id);
    const orderTotal = this.getOrderTotal(order.id || '');
    const itemsCount = this.getOrderLines(order.id || '').length;
    const taxAmount = this.calculateTax(order.id || '');
    const subtotal = this.calculateSubtotal(order.id || '');
    
    const invoiceDetails = `
      INVOICE DETAILS
      ===============
      Order ID: ${order.id}
      Customer: ${customerName}
      ${userDetails?.email ? `Email: ${userDetails.email}` : ''}
      
      Items: ${itemsCount}
      Subtotal: ${subtotal.toFixed(2)} DH
      Tax (20%): ${taxAmount.toFixed(2)} DH
      Total: ${orderTotal.toFixed(2)} DH
      Status: ${order.orderStatus}
      
      Order Items:
      ${this.getOrderLines(order.id || '').map(line => {
        const productId = line.product_id || '';
        const product = productId ? this.getProductDetails(productId) : null;
        return `  • ${line.quantity} x ${product?.name || line.product_id || 'Unknown'} - ${(line.quantity * line.unitPrice).toFixed(2)} DH`;
      }).join('\n')}
    `;
    
    if (confirm(`Send invoice for order ${order.id}?\n\n${invoiceDetails}`)) {
      // Ici vous pourriez appeler un service d'envoi d'email
      console.log('Invoice sent:', { order, invoiceDetails });
      alert(`Invoice for order ${order.id} has been sent to ${customerName}`);
    }
  }

  printOrder(): void {
    if (this.selectedOrder) {
      const userDetails = this.getUserDetails(this.selectedOrder.user_id);
      const orderLines = this.getOrderLines(this.selectedOrder.id || '');
      const subtotal = this.calculateSubtotal(this.selectedOrder.id || '');
      const tax = this.calculateTax(this.selectedOrder.id || '');
      const total = this.getOrderTotal(this.selectedOrder.id || '');
      
      const printContent = `
        <html>
          <head>
            <title>Order Invoice - ${this.selectedOrder.id}</title>
            <style>
              body { font-family: 'Arial', sans-serif; margin: 40px; color: #333; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              h1 { color: #2c3e50; margin: 0; }
              h2 { color: #3498db; margin-top: 30px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th { background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 12px; text-align: left; }
              td { border: 1px solid #dee2e6; padding: 10px; }
              .customer-info { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .summary { float: right; width: 300px; background-color: #e8f4fc; padding: 20px; border-radius: 5px; }
              .total { font-weight: bold; font-size: 1.2em; color: #2c3e50; }
              .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
              .product-name { font-weight: bold; }
              .product-ref { color: #666; font-size: 0.9em; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>ORDER INVOICE</h1>
              <p>Invoice #${this.selectedOrder.id}</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="customer-info">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${this.getUserName(this.selectedOrder.user_id)}</p>
              ${userDetails?.email ? `<p><strong>Email:</strong> ${userDetails.email}</p>` : ''}
              <p><strong>Order Status:</strong> ${this.selectedOrder.orderStatus}</p>
            </div>
            
            <h2>Order Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Reference</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderLines.map(line => {
                  const productId = line.product_id || '';
                  const product = productId ? this.getProductDetails(productId) : null;
                  return `
                    <tr>
                      <td class="product-name">${product?.name || line.product_id || 'N/A'}</td>
                      <td class="product-ref">${product?.sku || 'N/A'}</td>
                      <td>${line.quantity}</td>
                      <td>${line.unitPrice.toFixed(2)} DH</td>
                      <td>${(line.quantity * line.unitPrice).toFixed(2)} DH</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            
            <div class="summary">
              <h3>Order Summary</h3>
              <table>
                <tr>
                  <td>Subtotal:</td>
                  <td>${subtotal.toFixed(2)} DH</td>
                </tr>
                <tr>
                  <td>Tax (20%):</td>
                  <td>${tax.toFixed(2)} DH</td>
                </tr>
                <tr class="total">
                  <td>Total:</td>
                  <td>${total.toFixed(2)} DH</td>
                </tr>
              </table>
            </div>
            
            <div style="clear: both;"></div>
            
            <div class="footer">
              <p>Thank you for your business!</p>
              <p><em>Printed on: ${new Date().toLocaleString()}</em></p>
            </div>
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  }

  saveNotes(): void {
    console.log('Notes saved:', this.orderNotes);
    // Ici vous pourriez sauvegarder les notes dans votre backend
    alert('Order notes saved successfully!');
  }

  // Méthode pour obtenir les utilisateurs disponibles
  getAvailableUsers(): User[] {
    return this.users;
  }

  // Méthode pour obtenir les produits disponibles
  getAvailableProducts(): Product[] {
    return this.products;
  }

  // Méthode pour rendre Math accessible dans le template
  get Math() {
    return Math;
  }

  // Méthode pour recharger les données
  refreshData(): void {
    this.loadProducts();
    this.loadUsers();
    alert('Data refreshed successfully!');
  }
}