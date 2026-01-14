import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryDataLoding } from './inventory.model';
import { InventoryView } from './inventory-view.model';
import { InventoryService } from '../services/inventory-service';
import { Product } from '../product/product';
import { warehouses } from '../warehouses/warehouses.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-component.html'
})
export class InventoryComponent {
  @Input() inventories: InventoryView[] = [];
  @Input() products: Product[] = [];
  @Input() warehouses: warehouses[] = [];

  @Output() inventoryCreated = new EventEmitter<void>();
  @Output() inventoryUpdated = new EventEmitter<void>();
  @Output() inventoryDeleted = new EventEmitter<void>();

  constructor(private inventoryService: InventoryService) {}

  showForm: boolean = false;
  isEditMode: boolean = false;

  currentInventoryId: string = '';

  formData: InventoryDataLoding = {
    id: '',
    qtyOnHand: 0,
    qtyReserved: 0,
    referenceDocument: '',
    product_id: '',
    warehouse_id: ''
  };

  showAddForm(): void {
    this.resetForm();
    this.isEditMode = false;
    this.showForm = true;
  }

  editInventory(item: InventoryView): void {

    const inventoryId = (item as any).id || '';

    const selectedProduct = this.products.find(p => p.name === item.productName);
    const selectedWarehouse = this.warehouses.find(w => w.name === item.warehouseName);

    this.formData = {
      id: inventoryId,
      qtyOnHand: item.qtyOnHand,
      qtyReserved: item.qtyReserved,
      referenceDocument: item.referenceDocument || '',
      product_id: selectedProduct?.id || '',
      warehouse_id: selectedWarehouse?.id || ''
    };

    this.currentInventoryId = inventoryId;
    this.isEditMode = true;
    this.showForm = true;

    setTimeout(() => {
      document.querySelector('.bg-white.p-6')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  saveInventory(): void {
    if (this.isEditMode && this.currentInventoryId) {
      // Mise à jour
      this.inventoryService.updateInventory(this.currentInventoryId, this.formData)
        .subscribe({
          next: (res) => {
            const updatedId = this.currentInventoryId;
            const idx = this.inventories.findIndex(i => (i as any).id === updatedId);
            if (idx !== -1) {
              const productName = this.products.find(p => (p as any).id === this.formData.product_id)?.name || this.products.find(p => p.name === this.formData.product_id)?.name || '';
              const warehouseName = this.warehouses.find(w => (w as any).id === this.formData.warehouse_id)?.name || this.warehouses.find(w => w.name === this.formData.warehouse_id)?.name || '';
              const updatedItem: InventoryView = {
                ...(this.inventories[idx] as any),
                qtyOnHand: this.formData.qtyOnHand,
                qtyReserved: this.formData.qtyReserved,
                referenceDocument: this.formData.referenceDocument || '',
                productName,
                warehouseName,
                id: updatedId
              };
              const newArr = [...this.inventories];
              newArr[idx] = updatedItem;
              this.inventories = newArr;
            }
            this.inventoryUpdated.emit();
            this.cancelForm();
          },
          error: (err) => {
            console.error('Error updating inventory', err);
          }
        });
    } else {
      // Création
      this.inventoryService.createInventories(this.formData)
        .subscribe({
          next: (res) => {
            const createdId = (res && (res as any).id) || this.formData.id || '';
            const productName = this.products.find(p => (p as any).id === this.formData.product_id)?.name || this.products.find(p => p.name === this.formData.product_id)?.name || '';
            const warehouseName = this.warehouses.find(w => (w as any).id === this.formData.warehouse_id)?.name || this.warehouses.find(w => w.name === this.formData.warehouse_id)?.name || '';
            const newItem: InventoryView = {
              id: createdId,
              qtyOnHand: this.formData.qtyOnHand,
              qtyReserved: this.formData.qtyReserved,
              referenceDocument: this.formData.referenceDocument || '',
              productName,
              warehouseName
            } as any;
            this.inventories = [...this.inventories, newItem];
            this.inventoryCreated.emit();
            this.cancelForm();
          },
          error: (err) => {
            console.error('Error saving inventory', err);
          }
        });
    }
  }

  deleteInventory(item: InventoryView): void {
    const inventoryId = (item as any).id || '';

    if (!inventoryId) {
      console.error('No inventory ID found for deletion');
      return;
    }

    if (confirm('Are you sure you want to delete this inventory item?')) {
      this.inventoryService.deleteInventory(inventoryId)
        .subscribe({
          next: () => {
            this.inventories = this.inventories.filter(i => ((i as any).id || '') !== inventoryId);
            this.inventoryDeleted.emit();
          },
          error: (err) => {
            console.error('Error deleting inventory', err);
          }
        });
    }
  }

  cancelForm(): void {
    this.resetForm();
    this.showForm = false;
  }

  private resetForm(): void {
    this.formData = {
      id: '',
      qtyOnHand: 0,
      qtyReserved: 0,
      referenceDocument: '',
      product_id: '',
      warehouse_id: ''
    };
    this.currentInventoryId = '';
  }
}
