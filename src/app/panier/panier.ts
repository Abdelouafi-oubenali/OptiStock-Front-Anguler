import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../users/user.model';
import { Product } from '../product/product';

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

  cartItems: any[] = [];

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData);
    }

    // Si un produit a été ajouté récemment, on l'ajoute au panier
    if (this.productSelect) {
      this.addItemToCart(this.productSelect);
    }
  }

  addItemToCart(product: Product): void {
    // Vérifier si le produit existe déjà dans le panier
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
      item.quantity = Math.max(1, quantity); // Minimum 1
      this.saveCart();
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
    console.log('Commande passée pour l\'utilisateur:', this.user?.email);
    console.log('Articles:', this.cartItems);
    console.log('Total:', this.getTotal());
    alert('Fonctionnalité de paiement à implémenter');
  }
}
