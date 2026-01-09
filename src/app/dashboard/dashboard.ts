import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductComponent } from '../product/product';
import { ProductService } from '../services/product-service';

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
  imports: [CommonModule, FormsModule, ProductComponent],
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

  // Données mockées
  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { id: 'products', label: 'Products', icon: 'package' },
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

  // Données des produits
  products: Product[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Products loaded in dashboard:', data);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }



  categoryData = [
    { name: 'Electronics', value: 35, color: '#3b82f6' },
    { name: 'Furniture', value: 25, color: '#10b981' },
    { name: 'Stationery', value: 20, color: '#f59e0b' },
    { name: 'Tools', value: 15, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#8b5cf6' }
  ];

constructor(private productService: ProductService) {}

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
    console.log('Search query:', query);
  }

  onProductViewed(product: Product): void {
    console.log('Product viewed:', product);
  }

  onProductEdited(product: Product): void {
    console.log('Product edited:', product);
  }

  onProductDeleted(product: Product): void {
    console.log('Product deleted:', product);
    const index = this.products.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.products.splice(index, 1);
    }
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
}