import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product/product';
import { ProductService } from '../services/product-service';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  isLoading = true;
  errorMessage = '';
  isDebugMode = false;

  constructor(
    private productService: ProductService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🏠 HomeComponent initialisé');
    this.loadProducts();
  }

  loadProducts(): void {
    console.log('🔄 Début du chargement des produits');
    this.isLoading = true;
    this.errorMessage = '';

    this.cdRef.detectChanges();

    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log(' Produits chargés avec succès:', data);

        this.products = Array.isArray(data) ? data : [];
        this.isLoading = false;

        console.log(' Nombre de produits:', this.products.length);
        console.log(' isLoading:', this.isLoading);

        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error(' Erreur de chargement:', err);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des produits. Veuillez réessayer.';
        this.cdRef.detectChanges();
      },
      complete: () => {
        console.log('Chargement des produits terminé');
      }
    });
  }

  // Méthode pour générer une image de produit
  getProductImage(product: Product): string {
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return product.imageUrl;
    }

    const productName = encodeURIComponent(product.name.substring(0, 20));
    return `https://via.placeholder.com/400x400/1e293b/94a3b8?text=${productName}`;
  }

  // Méthode pour gérer les erreurs d'image
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/400x400/1e293b/94a3b8?text=Image+Non+Disponible';
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
    console.log("product " , product.stock )
    return product.stock !== undefined && product.stock > 0;
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
