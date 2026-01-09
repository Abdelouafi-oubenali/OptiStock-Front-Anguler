import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product-service';
import { Router } from '@angular/router';

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  status: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html'
})
export class ProductComponent {
  @Input() products: Product[] = [];
  @Input() searchQuery = '';
  @Input() darkMode = false;
  
  @Output() searchChange = new EventEmitter<string>();
  @Output() productViewed = new EventEmitter<Product>();
  @Output() productEdited = new EventEmitter<Product>();
  @Output() productDeleted = new EventEmitter<Product>();
  @Output() productAdded = new EventEmitter<void>();


  get filteredProducts(): Product[] {
    if (!this.searchQuery.trim()) {
      return this.products;
    }
    
    const query = this.searchQuery.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.price.toString ||
      product.status.toLowerCase().includes(query)
    );
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

  get tableHeaderBg(): string {
    return this.darkMode ? 'bg-gray-700' : 'bg-gray-50';
  }

  get tableRowHover(): string {
    return this.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'In Stock':
        return this.darkMode 
          ? 'bg-green-900/30 text-green-300' 
          : 'bg-green-100 text-green-700';
      case 'Low Stock':
        return this.darkMode 
          ? 'bg-orange-900/30 text-orange-300' 
          : 'bg-orange-100 text-orange-700';
      default:
        return this.darkMode 
          ? 'bg-red-900/30 text-red-300' 
          : 'bg-red-100 text-red-700';
    }
  }

  getActionBtnClass(): string {
    return this.darkMode 
      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
  }

  // Méthode pour formater les nombres
  formatNumber(value: number): string {
    return value.toLocaleString();
  }

  // Méthode pour obtenir les icônes
  getIcon(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      'eye': '👁️',
      'edit': '✏️',
      'trash': '🗑️',
      'plus': '+',
      'search': '🔍'
    };
    return iconMap[iconName] || '📦';
  }

  // Méthodes d'actions qui émettent des événements
  viewProduct(product: Product): void {
    this.productViewed.emit(product);
  }

  editProduct(product: Product): void {
    this.productEdited.emit(product);
  }

  deleteProduct(product: Product): void {
    this.productDeleted.emit(product);
  }

  addProduct(): void {
    this.productAdded.emit();
  }

  onSearchChange(event: any): void {
    this.searchChange.emit(event.target.value);
  }
}