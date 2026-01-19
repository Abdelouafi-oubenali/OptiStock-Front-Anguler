import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {User} from '../users/user.model';

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-component.html',
  styleUrls: ['./orders-component.css'],
})
export class OrdersComponent implements OnInit {
  @Input() userLogin: User | null = null;

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  searchTerm: string = '';
  statusFilter: string = 'all';
  dateRange = {
    start: '',
    end: ''
  };

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  sortBy: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  selectedOrder: Order | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadUserOrders();
  }

  loadUserOrders(): void {
    console.log('🚀 Début du chargement des commandes...');

    if (!this.userLogin) {
      console.warn('⚠️ Aucun utilisateur connecté');
      this.errorMessage = 'Vous devez être connecté pour voir vos commandes';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.mockLoadOrders();
      this.applyFilters();
      this.updatePagination();
      console.log(`✅ ${this.orders.length} commande(s) chargée(s)`);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des commandes:', error);
      this.errorMessage = 'Erreur lors du chargement de vos commandes';
    } finally {
      this.isLoading = false;
    }
  }

  // GETTERS pour les calculs
  get totalOrdersCount(): number {
    return this.filteredOrders.length;
  }

  get deliveredOrdersCount(): number {
    return this.filteredOrders.filter(o => o.status === 'delivered').length;
  }

  get totalAmountSum(): number {
    return this.filteredOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  }

  // Méthodes pour la pagination
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
  }

  private mockLoadOrders(): void {
    this.orders = [
      {
        id: 'ORD-001',
        orderNumber: 'CMD-2024-001',
        date: new Date('2024-03-15'),
        totalAmount: 299.99,
        status: 'delivered',
        items: [
          { productId: 'P001', productName: 'Smartphone Pro', quantity: 1, unitPrice: 299.99, total: 299.99 }
        ]
      },
      {
        id: 'ORD-002',
        orderNumber: 'CMD-2024-002',
        date: new Date('2024-03-10'),
        totalAmount: 599.97,
        status: 'processing',
        items: [
          { productId: 'P002', productName: 'Casque Audio', quantity: 2, unitPrice: 149.99, total: 299.98 },
          { productId: 'P003', productName: 'Souris Gaming', quantity: 1, unitPrice: 299.99, total: 299.99 }
        ]
      },
      {
        id: 'ORD-003',
        orderNumber: 'CMD-2024-003',
        date: new Date('2024-03-05'),
        totalAmount: 129.99,
        status: 'shipped',
        items: [
          { productId: 'P004', productName: 'Clavier Mécanique', quantity: 1, unitPrice: 129.99, total: 129.99 }
        ]
      },
      {
        id: 'ORD-004',
        orderNumber: 'CMD-2024-004',
        date: new Date('2024-02-28'),
        totalAmount: 89.99,
        status: 'cancelled',
        items: [
          { productId: 'P005', productName: 'Webcam HD', quantity: 1, unitPrice: 89.99, total: 89.99 }
        ]
      },
      {
        id: 'ORD-005',
        orderNumber: 'CMD-2024-005',
        date: new Date('2024-02-20'),
        totalAmount: 459.98,
        status: 'delivered',
        items: [
          { productId: 'P006', productName: 'Écran 27"', quantity: 1, unitPrice: 329.99, total: 329.99 },
          { productId: 'P007', productName: 'Support écran', quantity: 1, unitPrice: 129.99, total: 129.99 }
        ]
      }
    ];
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(term) ||
        order.items.some(item => item.productName.toLowerCase().includes(term))
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }

    if (this.dateRange.start) {
      const startDate = new Date(this.dateRange.start);
      filtered = filtered.filter(order => order.date >= startDate);
    }

    if (this.dateRange.end) {
      const endDate = new Date(this.dateRange.end);
      filtered = filtered.filter(order => order.date <= endDate);
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'number':
          comparison = a.orderNumber.localeCompare(b.orderNumber);
          break;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredOrders = filtered;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  get paginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  sortOrders(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'desc';
    }
    this.applyFilters();
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'processing': 'En traitement',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'bg-yellow-500/20 text-yellow-400',
      'processing': 'bg-blue-500/20 text-blue-400',
      'shipped': 'bg-purple-500/20 text-purple-400',
      'delivered': 'bg-green-500/20 text-green-400',
      'cancelled': 'bg-red-500/20 text-red-400'
    };
    return classes[status] || 'bg-gray-500/20 text-gray-400';
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.dateRange = { start: '', end: '' };
    this.sortBy = 'date';
    this.sortDirection = 'desc';
    this.currentPage = 1;
    this.applyFilters();
  }

  downloadInvoice(order: Order): void {
    console.log(`📄 Téléchargement de la facture: ${order.orderNumber}`);
    alert(`Facture ${order.orderNumber} téléchargée (simulation)`);
  }
}
