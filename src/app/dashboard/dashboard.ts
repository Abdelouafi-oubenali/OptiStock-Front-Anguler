import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductComponent } from '../product/product';
import { ProductService } from '../services/product-service';
import { UserService } from '../services/user-service';
import { UserComponent } from '../users/UsersComponent';
import { User } from '../users/user.model';
import { warehouses } from '../warehouses/warehouses.model';
import { WarehousesComponent } from '../warehouses/warehousesComponent';
import { WarehousesService } from '../services/warehoses-serviece';
import {InventoryComponent} from '../inventory-component/inventory-component';
import {InventoryDataLoding} from '../inventory-component/inventory.model';
import {InventoryService} from '../services/inventory-service';
import {InventoryView} from '../inventory-component/inventory-view.model';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

interface StatCard {
  title: string;
  value: number;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  change?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductComponent, UserComponent, WarehousesComponent , InventoryComponent],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  // États
  sidebarOpen = true;
  darkMode = false;
  currentView = 'dashboard';
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 10;

  // État de chargement
  isLoading = {
    products: false,
    users: false,
    warehouses: false,
    inventories: false
  };

  // Données mockées
  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { id: 'users', label: 'Users', icon: 'users' },
    { id: 'products', label: 'Products', icon: 'package' },
    { id: 'warehouses', label: 'Warehouses', icon: 'warehouse' },
    { id: 'inventories', label: 'Inventories', icon: 'boxes' },
    { id: 'suppliers', label: 'Suppliers', icon: 'truck' },
    { id: 'customers', label: 'Customers', icon: 'users' },
    { id: 'transactions', label: 'Transactions', icon: 'credit-card' },
    { id: 'reports', label: 'Reports', icon: 'bar-chart-2' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  mockAnalytics = {
    totalStockValue: 1254300,
    totalSales: 892500,
    totalPurchases: 745200,
    profit: 147300,
    salesGrowth: 12.5,
    purchaseGrowth: -3.2,
    profitGrowth: 8.7
  };

  // Données
  products: Product[] = [];
  users: User[] = [];
  warehouses: warehouses[] = [];
  inventoryView: InventoryView[] = [];

  // Maps pour cache
  private productMap: Map<string, Product> = new Map();
  private warehouseMap: Map<string, warehouses> = new Map();

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private warehousesService: WarehousesService,
    private inventoryService: InventoryService,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      await Promise.all([
        this.loadProducts(),
        this.loadWarehouses()
      ]);

      this.loadInventories();

      this.loadUsers();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  loadProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isLoading.products = true;
      this.productService.getProducts().subscribe({
        next: (data) => {
          this.products = data;
          this.productMap.clear();
          data.forEach(product => {
            if(product.id == undefined) {
              return ;
            }
            this.productMap.set(product.id, product);
          });
          this.isLoading.products = false;
          console.log('Products loaded in dashboard:', data);
          resolve();
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.isLoading.products = false;
          reject(err);
        }
      });
    });
  }

  loadUsers(): void {
    this.isLoading.users = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading.users = false;
        console.log('Users loaded in dashboard:', data);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading.users = false;
      }
    });
  }

  loadWarehouses(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isLoading.warehouses = true;
      this.warehousesService.getWarehouses().subscribe({
        next: (data) => {
          this.warehouses = data;
          this.warehouseMap.clear();
          data.forEach(warehouse => {
            if(warehouse.id == undefined) {
              return
            }
            this.warehouseMap.set(warehouse.id, warehouse);
          });
          this.isLoading.warehouses = false;
          console.log('Warehouses loaded in dashboard:', data);
          resolve();
        },
        error: (err) => {
          console.error('Error loading warehouses:', err);
          this.isLoading.warehouses = false;
          reject(err);
        }
      });
    });
  }

  loadInventories(): void {
    if (this.products.length === 0 || this.warehouses.length === 0) {
      console.warn('Products or warehouses not loaded yet, retrying...');
      setTimeout(() => this.loadInventories(), 1000);
      return;
    }

    this.isLoading.inventories = true;
    this.inventoryService.getInventories().subscribe({
      next: (data) => {
        this.inventoryView = data.map(inv => ({
          id: inv.id,
          qtyOnHand: inv.qtyOnHand,
          qtyReserved: inv.qtyReserved,
          referenceDocument: inv.referenceDocument,
          productName: this.getProductById(inv.product_id),
          warehouseName: this.getWarehouseById(inv.warehouse_id),
        }));
        this.isLoading.inventories = false;
        console.log('Inventories loaded in dashboard:', this.inventoryView);
      },
      error: (err) => {
        console.error('Error loading inventories:', err);
        this.isLoading.inventories = false;
      }
    });
  }

  // Helper methods avec cache
  private getProductById(id: string): string {
    return this.productMap.get(id)?.name ?? 'Unknown product';
  }

  private getWarehouseById(id: string): string {
    return this.warehouseMap.get(id)?.name ?? 'Unknown warehouse';
  }

  // Event handlers
  onUsersChanged(updatedUsers: User[]): void {
    this.users = updatedUsers;
    console.log('Users updated:', updatedUsers);
  }

  onWarehousesChanged(updatedWarehouses: warehouses[]): void {
    this.warehouses = updatedWarehouses;
    // Mettre à jour le cache
    this.warehouseMap.clear();
    updatedWarehouses.forEach(warehouse => {
      if(warehouse.id == undefined) {
        return;
      }
      this.warehouseMap.set(warehouse.id, warehouse);
    });
    console.log('Warehouses updated in dashboard:', updatedWarehouses);
  }

  onProductChanged(updatedProducts: Product[]): void {
    this.products = updatedProducts;
    // Mettre à jour le cache
    this.productMap.clear();
    updatedProducts.forEach(product => {
      if(product.id == undefined) {
        return;
      }
      this.productMap.set(product.id, product);
    });
    console.log('Products updated in dashboard:', updatedProducts);
  }

  onInventoryChanged(updatedInventory: InventoryView[]): void {
    this.inventoryView = updatedInventory;
    console.log('Inventory updated:', updatedInventory);
  }

  // Gestion des données filtrées et paginées
  get filteredData(): any[] {
    switch (this.currentView) {
      case 'products':
        return this.filterItems(this.products);
      case 'users':
        return this.filterItems(this.users);
      case 'warehouses':
        return this.filterItems(this.warehouses);
      case 'inventories':
        return this.filterItems(this.inventoryView);
      default:
        return [];
    }
  }

  private filterItems(items: any[]): any[] {
    if (!this.searchQuery) return items;

    const query = this.searchQuery.toLowerCase();
    return items.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(query)
      )
    );
  }

  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  // Fonction de rafraîchissement
  refreshData(): void {
    switch (this.currentView) {
      case 'products':
        this.loadProducts();
        break;
      case 'users':
        this.loadUsers();
        break;
      case 'warehouses':
        this.loadWarehouses();
        break;
      case 'inventories':
        this.loadInventories();
        break;
      default:
        this.ngOnInit();
    }
  }

  categoryData = [
    { name: 'Electronics', value: 35, color: '#3b82f6' },
    { name: 'Furniture', value: 25, color: '#10b981' },
    { name: 'Stationery', value: 20, color: '#f59e0b' },
    { name: 'Tools', value: 15, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#8b5cf6' }
  ];

  // Classes CSS conditionnelles
  get bgClass(): string {
    return this.darkMode ? 'bg-gray-900' : 'bg-gray-50';
  }

  get cardBg(): string {
    return this.darkMode ? 'bg-gray-800' : 'bg-white';
  }

  get borderColor(): string {
    return this.darkMode ? 'border-gray-700' : 'border-gray-200';
  }

  get textPrimary(): string {
    return this.darkMode ? 'text-white' : 'text-gray-900';
  }

  get textSecondary(): string {
    return this.darkMode ? 'text-gray-300' : 'text-gray-600';
  }

  // Méthodes principales
  setCurrentView(view: string): void {
    this.currentView = view;
    this.currentPage = 1;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    console.log('Search query:', query);
  }

  onProductViewed(product: Product): void {
    console.log('Product viewed:', product);
  }

  onProductEdited(product: Product): void {
    console.log('Product edited:', product);
  }

  onProductAdded(): void {
    console.log('Add new product clicked');
  }

  getCurrentViewLabel(): string {
    const menuItem = this.menuItems.find(m => m.id === this.currentView);
    return menuItem ? menuItem.label : 'View';
  }

  getStats(): StatCard[] {
    return [
      {
        title: 'Total Stock Value',
        value: this.mockAnalytics.totalStockValue,
        icon: 'package',
        trend: 'neutral'
      },
      {
        title: 'Total Sales',
        value: this.mockAnalytics.totalSales,
        icon: 'trending-up',
        change: this.mockAnalytics.salesGrowth,
        trend: 'up'
      },
      {
        title: 'Total Purchases',
        value: this.mockAnalytics.totalPurchases,
        icon: 'shopping-cart',
        change: this.mockAnalytics.purchaseGrowth,
        trend: 'down'
      },
      {
        title: 'Net Profit',
        value: this.mockAnalytics.profit,
        icon: 'dollar-sign',
        change: this.mockAnalytics.profitGrowth,
        trend: 'up'
      }
    ];
  }

  getTrendColorClass(trend: 'up' | 'down' | 'neutral'): string {
    switch (trend) {
      case 'up': return 'bg-green-100';
      case 'down': return 'bg-red-100';
      default: return 'bg-blue-100';
    }
  }

  getTrendIconColorClass(trend: 'up' | 'down' | 'neutral'): string {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-blue-600';
    }
  }

  getStatusClass(status: string): string {
    if (this.darkMode) {
      switch (status) {
        case 'In Stock': return 'bg-green-900/30 text-green-300';
        case 'Low Stock': return 'bg-orange-900/30 text-orange-300';
        default: return 'bg-red-900/30 text-red-300';
      }
    } else {
      switch (status) {
        case 'In Stock': return 'bg-green-100 text-green-700';
        case 'Low Stock': return 'bg-orange-100 text-orange-700';
        default: return 'bg-red-100 text-red-700';
      }
    }
  }

  getIcon(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      'grid': '📊',
      'package': '📦',
      'warehouse': '🏭',
      'boxes': '📦',
      'truck': '🚚',
      'users': '👥',
      'credit-card': '💳',
      'bar-chart-2': '📈',
      'settings': '⚙️',
      'trending-up': '📈',
      'shopping-cart': '🛒',
      'dollar-sign': '💵',
      'search': '🔍',
      'filter': '⚙️',
      'eye': '👁️',
      'edit': '✏️',
      'trash': '🗑️',
      'plus': '+',
      'download': '📥',
      'bell': '🔔',
      'sun': '☀️',
      'moon': '🌙',
      'menu': '☰',
      'close': '✕',
      'chevron-left': '◀',
      'chevron-right': '▶'
    };
    return iconMap[iconName] || '📦';
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }

  get Math() {
    return Math;
  }

  getChangeClass(change: number | undefined): string {
    if (!change) return '';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  }

  getChangeIcon(change: number | undefined): string {
    if (!change) return '';
    return change > 0 ? '↗' : '↘';
  }

  isLoadingView(): boolean {
    switch (this.currentView) {
      case 'products': return this.isLoading.products;
      case 'users': return this.isLoading.users;
      case 'warehouses': return this.isLoading.warehouses;
      case 'inventories': return this.isLoading.inventories;
      default: return false;
    }
  }
}
