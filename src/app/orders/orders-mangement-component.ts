import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalseOrder, SalesOrderLine } from './order-models';

@Component({
  selector: 'app-orders-mangement', // CHANGÉ : "mangement" au lieu de "management"
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-mangement-component.html',
  styleUrls: ['./orders-mangement-component.css']
})
export class OrdersManagementComponent implements OnInit {

  @Input() salseOrder: SalseOrder[] = [];
  @Input() salesOrdersLine: SalesOrderLine[] = [];

  // Propriétés pour le composant
  currentView = 'list';
  searchQuery = '';
  isLoading = false;

  // Pour la pagination
  currentPage = 1;
  itemsPerPage = 10; // AJOUTÉ

  // Données pour l'affichage (simulées si manquantes)
  private userNames: Map<string, string> = new Map([
    ['1', 'John Doe'],
    ['2', 'Jane Smith'],
    ['3', 'Robert Johnson'],
    ['4', 'Emily Davis'],
    ['5', 'Michael Wilson']
  ]);

  ngOnInit(): void {
    console.log('OrdersManagementComponent initialized');
    console.log('Orders:', this.salseOrder);
    console.log('Order lines:', this.salesOrdersLine);
  }

  // Méthodes pour gérer les commandes
  get filteredOrders(): SalseOrder[] {
    if (!this.searchQuery) return this.salseOrder;

    const query = this.searchQuery.toLowerCase();
    return this.salseOrder.filter(order => {
      const userName = this.getUserName(order.user_id);
      return (
        order.id?.toLowerCase().includes(query) ||
        order.user_id.toLowerCase().includes(query) ||
        userName.toLowerCase().includes(query) ||
        order.orderStatus.toLowerCase().includes(query)
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

  // Méthodes pour les actions
  createOrder(): void {
    console.log('Create new order');
    const newOrder: SalseOrder = {
      id: `ORD${Date.now()}`,
      user_id: '1',
      orderStatus: 'pending'
    };

    this.salseOrder = [newOrder, ...this.salseOrder];
  }

  editOrder(order: SalseOrder): void {
    console.log('Edit order:', order);
    const status = prompt('Nouveau statut:', order.orderStatus);
    if (status) {
      order.orderStatus = status;
    }
  }

  deleteOrder(order: SalseOrder): void {
    console.log('Delete order:', order);
    if (confirm(`Supprimer la commande ${order.id} ?`)) {
      this.salseOrder = this.salseOrder.filter(o => o.id !== order.id);
    }
  }

  viewOrderDetails(order: SalseOrder): void {
    console.log('View order details:', order);
    this.currentView = 'details';
  }

  goBackToList(): void {
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
    return this.userNames.get(userId) || `User ${userId}`;
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

  // Méthode pour rendre Math accessible dans le template
  get Math() {
    return Math;
  }
}
