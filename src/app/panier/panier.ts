import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../users/user.model';
import { Product } from '../product/product';
import {OrderService} from '../services/order-service';
import {SalesOrderLine , SalseOrder } from '../orders/order-models';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panier.html',
  styleUrls: ['./panier.css']
})
export class Panier implements OnInit {
  @Input() user: User | null = null;
  @Input() productSelect: Product | null = null;
  @Input() currentSalesOrder: SalseOrder | null = null;

  salseOrderLine: SalesOrderLine | null = null;

  constructor(private orderService : OrderService) {}

  cartItems: any[] = [];

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData);
    }

    if (this.productSelect) {
      this.addItemToCart(this.productSelect);
    }
  }

  addItemToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart();
  }

  removeItemFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity); // الحد الأدنى 1
      this.saveCart();

      if (this.productSelect && this.productSelect.id === productId) {
        this.productSelect.quantity = item.quantity;
      }
    }
  }


  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }

  checkout(): void {
    if (!this.currentSalesOrder) {
      alert('Aucun produit ou commande sélectionné');
      return;
    }

    this.cartItems.forEach(item => {
      const orderLine: SalesOrderLine = {
        product_id: item.id,
        sales_order_id: this.currentSalesOrder!.id!,
        quantity: item.quantity,
        unitPrice: item.price
      };

      this.orderService.createSalesOrderLine(orderLine).subscribe({
        next: (res) => console.log('Ligne créée :', res),
        error: (err) => console.error('Erreur ligne', err)
      });
    });

    alert('Tous les produits ont été ajoutés à la commande !');
    this.clearCart();
  }


}
