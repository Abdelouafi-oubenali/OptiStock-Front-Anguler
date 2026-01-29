import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  loadShipments,
  loadShipment,
  createShipment,
  updateShipment,
  deleteShipment,
  setPagination,
  clearSelectedShipment
} from './store/shipments.actions';
import {
  selectAllShipments,
  selectSelectedShipment,
  selectShipmentsLoading,
  selectShipmentsError,
  selectShipmentsTotal,
  selectShipmentsPagination
} from './store/shipments.selectors';
import { Shipment } from './store/shipments.state';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ShipmentsComponent implements OnInit, OnDestroy {
  // Observables
  shipments$: Observable<Shipment[]>;
  selectedShipment$: Observable<Shipment | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  total$: Observable<number>;
  pagination$: Observable<{ page: number; pageSize: number; total: number }>;

  // Variables locales
  shipments: Shipment[] = [];
  selectedShipment: Shipment | null = null;
  loading = false;
  error: string | null = null;
  total = 0;
  page = 1;
  pageSize = 10;

  // Exposer Math pour l'utiliser dans le template
  Math = Math;

  // Formulaires
  shipmentForm: FormGroup;
  searchForm: FormGroup;

  // États UI
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  statuses = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

  private subscriptions = new Subscription();

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    // Initialisation des observables
    this.shipments$ = this.store.select(selectAllShipments);
    this.selectedShipment$ = this.store.select(selectSelectedShipment);
    this.loading$ = this.store.select(selectShipmentsLoading);
    this.error$ = this.store.select(selectShipmentsError);
    this.total$ = this.store.select(selectShipmentsTotal);
    this.pagination$ = this.store.select(selectShipmentsPagination);

    // Initialisation des formulaires
    this.shipmentForm = this.fb.group({
      trackingNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{8,20}$/)]],
      status: ['PENDING', Validators.required],
      plannedDate: ['', Validators.required],
      shippedDate: [''],
      deliveredDate: [''],
      salesOrderId: ['', [Validators.required, Validators.pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)]],
      carrierId: ['', [Validators.required, Validators.pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)]]
    });

    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {

    // Charger les expéditions initiales
    this.store.dispatch(loadShipments({ page: this.page, pageSize: this.pageSize }));

    // Souscriptions
    this.subscriptions.add(
      this.shipments$.subscribe(shipments => {
        console.log('📦 Shipments data received:', shipments);
        this.shipments = shipments;
      })
    );

    this.subscriptions.add(
      this.selectedShipment$.subscribe(shipment => {
        this.selectedShipment = shipment;
        if (shipment) {
          this.patchForm(shipment);
        }
      })
    );

    this.subscriptions.add(
      this.loading$.subscribe(loading => {
        console.log('⏳ Loading status:', loading);
        this.loading = loading;
      })
    );

    this.subscriptions.add(
      this.error$.subscribe(error => {
        this.error = error;
      })
    );

    this.subscriptions.add(
      this.total$.subscribe(total => {
        this.total = total;
      })
    );

    this.subscriptions.add(
      this.pagination$.subscribe(pagination => {
        console.log('📄 Pagination:', pagination);
        this.page = pagination.page;
        this.pageSize = pagination.pageSize;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Navigation par pages
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.store.dispatch(setPagination({ page: newPage, pageSize: this.pageSize }));
    this.store.dispatch(loadShipments({ page: newPage, pageSize: this.pageSize }));
  }

  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.store.dispatch(setPagination({ page: 1, pageSize: newPageSize }));
    this.store.dispatch(loadShipments({ page: 1, pageSize: newPageSize }));
  }

  // Remplir le formulaire avec les données
  patchForm(shipment: Shipment): void {
    this.shipmentForm.patchValue({
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      plannedDate: shipment.plannedDate ? shipment.plannedDate.split('T')[0] : '',
      shippedDate: shipment.shippedDate ? shipment.shippedDate.split('T')[0] : '',
      deliveredDate: shipment.deliveredDate ? shipment.deliveredDate.split('T')[0] : '',
      salesOrderId: shipment.salesOrderId,
      carrierId: shipment.carrierId
    });
  }

  // Ouvrir modal de création
  openCreateModal(): void {
    this.shipmentForm.reset({
      status: 'PENDING',
      trackingNumber: '',
      plannedDate: '',
      shippedDate: '',
      deliveredDate: '',
      salesOrderId: '',
      carrierId: ''
    });
    this.showCreateModal = true;
  }

  // Ouvrir modal d'édition
  openEditModal(shipment: Shipment): void {
    this.store.dispatch(loadShipment({ trackingNumber: shipment.trackingNumber }));
    this.showEditModal = true;
  }

  // Ouvrir modal de suppression
  openDeleteModal(shipment: Shipment): void {
    this.store.dispatch(loadShipment({ trackingNumber: shipment.trackingNumber }));
    this.showDeleteModal = true;
  }

  // Fermer tous les modals
  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.store.dispatch(clearSelectedShipment());
  }

  // Créer une expédition
  onCreate(): void {
    if (this.shipmentForm.valid) {
      const formValue = this.shipmentForm.value;
      const shipmentData = {
        ...formValue,
        plannedDate: formValue.plannedDate ? `${formValue.plannedDate}T00:00:00` : null,
        shippedDate: formValue.shippedDate ? `${formValue.shippedDate}T00:00:00` : null,
        deliveredDate: formValue.deliveredDate ? `${formValue.deliveredDate}T00:00:00` : null
      };

      this.store.dispatch(createShipment({ shipment: shipmentData }));
      this.closeModals();
    }
  }

  // Mettre à jour une expédition
  onUpdate(): void {
    if (this.shipmentForm.valid && this.selectedShipment) {
      const formValue = this.shipmentForm.value;
      const shipmentData = {
        ...formValue,
        plannedDate: formValue.plannedDate ? `${formValue.plannedDate}T00:00:00` : null,
        shippedDate: formValue.shippedDate ? `${formValue.shippedDate}T00:00:00` : null,
        deliveredDate: formValue.deliveredDate ? `${formValue.deliveredDate}T00:00:00` : null
      };

      this.store.dispatch(updateShipment({
        trackingNumber: this.selectedShipment.trackingNumber,
        shipment: shipmentData
      }));
      this.closeModals();
    }
  }

  // Supprimer une expédition
  onDelete(): void {
    if (this.selectedShipment) {
      this.store.dispatch(deleteShipment({
        trackingNumber: this.selectedShipment.trackingNumber
      }));
      this.closeModals();
    }
  }

  // Recharger les données
  refresh(): void {
    this.store.dispatch(loadShipments({ page: this.page, pageSize: this.pageSize }));
  }

  // Rechercher
  onSearch(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (searchTerm) {
      // Implémentez la logique de recherche ici
      console.log('Searching for:', searchTerm);
    }
  }

  // Formater la date pour l'affichage
  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Obtenir les classes CSS selon le statut
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Calculer le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  // Générer un tableau de pages pour la pagination
  get pageNumbers(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
