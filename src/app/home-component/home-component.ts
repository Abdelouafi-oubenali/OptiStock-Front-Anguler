import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product/product';
import { ProductService } from '../services/product-service';
import {InventoryService} from '../services/inventory-service';
import {InventoryDataLoding} from '../inventory-component/inventory.model';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  inventoryDataLoding: InventoryDataLoding[] = [] ;

  isLoading = true;
  errorMessage = '';
  isDebugMode = false;

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log(' HomeComponent initialisé');
    this.loadAllData();
  }

  loadAllData(): void {
    console.log(' Début du chargement de toutes les données');
    this.isLoading = true;
    this.errorMessage = '';
    this.cdRef.detectChanges();

    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log(' Produits chargés:', products);
        this.products = Array.isArray(products) ? products : [];

        this.inventoryService.getInventories().subscribe({
          next: (inventories) => {
            console.log(' Inventaires chargés:', inventories);
            this.inventoryDataLoding = Array.isArray(inventories) ? inventories : [];
            this.isLoading = false;
            this.cdRef.detectChanges();
          },
          error: (err) => {
            console.error(' Erreur inventaire:', err);
            this.errorMessage = 'Erreur lors du chargement du stock';
            this.isLoading = false;
            this.cdRef.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error(' Erreur produits:', err);
        this.errorMessage = 'Erreur lors du chargement des produits';
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  getProductImage(product: Product): string {
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return product.imageUrl;
    }

    const productName = encodeURIComponent(product.name.substring(0, 20));
    return `https://placehold.co/400x400/1e293b/94a3b8?text=${productName}`;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://placehold.co/400x400/1e293b/94a3b8?text=Image+Non+Disponible';
    imgElement.onerror = null;
  }

  services = [
    {
      icon: '🛒',
      title: 'Achat de Produits',
      description: 'Large sélection de produits de qualité disponibles à l\'achat'
    },
    {
      icon: '📦',
      title: 'Gestion de Stock',
      description: 'Suivi en temps réel de la quantité de vos produits'
    },
    {
      icon: '🌍',
      title: 'Livraison Rapide',
      description: 'Livraison rapide et sécurisée partout dans le monde'
    },
    {
      icon: '💳',
      title: 'Paiement Sécurisé',
      description: 'Transactions sécurisées et plusieurs modes de paiement'
    }
  ];

  projectInfo = {
    totalProducts: 1250,
    totalSales: 5420,
    activeUsers: 890
  };

  isInStock(product: Product): boolean {
    if (!product.id) return false;

    const inventory = this.inventoryDataLoding.find(
      inv => inv.product_id === product.id
    );

    return inventory ? inventory.qtyOnHand > 0 : false;
  }

  addToCart(product: Product): void {
    console.log('🛒 Ajouter au panier:', product);
    alert(`Produit "${product.name}" ajouté au panier!`);
  }

  getProductBadge(product: Product): string {
    if (product.stock !== undefined && product.stock < 10 && product.stock > 0) {
      return 'Bientôt épuisé';
    }
    if (product.status === 'promo') {
      return 'Promo';
    }
    if (product.status === 'new') {
      return 'Nouveau';
    }
    return '';
  }

  toggleDebug(): void {
    this.isDebugMode = !this.isDebugMode;
  }
}
