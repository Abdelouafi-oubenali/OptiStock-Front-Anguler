import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { warehouses } from './warehouses.model';
import { WarehousesService } from '../services/warehoses-serviece';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warehousesComponent.html',
})
export class WarehousesComponent implements OnInit {
  @Input() warehouses: warehouses[] = [];
  @Output() warehousesChanged = new EventEmitter<warehouses[]>();

  // Form state
  showAddForm = false;
  isEditing = false;
  warehouseForm: any = { name: '', ville: '' };
  editingWarehouseId: string | null = null;

  // Loading state
  isLoading = false;
  errorMessage = '';

  constructor(private warehousesService: WarehousesService) {}

  ngOnInit(): void {
    if (this.warehouses.length === 0) {
      this.loadWarehouses();
    }
  }

  // Load warehouses from API
  loadWarehouses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.warehousesService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouses = data;
        this.warehousesChanged.emit(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load warehouses. Please try again.';
        this.isLoading = false;
        console.error('Error loading warehouses:', err);
      }
    });
  }

  // Handle form submission
  onSubmitWarehouseForm(): void {
    if (!this.warehouseForm.name || !this.warehouseForm.ville) {
      alert('Please fill all required fields');
      return;
    }

    if (this.isEditing && this.editingWarehouseId) {
      this.updateWarehouse();
    } else {
      this.createWarehouse();
    }
  }

  // Create new warehouse
  private createWarehouse(): void {
    const newWarehouse: warehouses = {
      name: this.warehouseForm.name,
      ville: this.warehouseForm.ville
    };

    this.warehousesService.createWarehouse(newWarehouse).subscribe({
      next: (createdWarehouse) => {
        this.warehouses = [...this.warehouses, createdWarehouse];
        this.warehousesChanged.emit(this.warehouses);
        console.log('Warehouse created:', createdWarehouse);
        this.resetForm();
      },
      error: (err) => {
        alert('Failed to create warehouse. Please try again.');
        console.error('Error creating warehouse:', err);
      }
    });
  }

  private updateWarehouse(): void {
    if (!this.editingWarehouseId) return;

    const updatedWarehouse: warehouses = {
      id: this.editingWarehouseId,
      name: this.warehouseForm.name,
      ville: this.warehouseForm.ville
    };

    this.warehousesService.updateWarehouse(updatedWarehouse).subscribe({
      next: (updatedData) => {
        this.warehouses = this.warehouses.map(w =>
          w.id === this.editingWarehouseId ? updatedData : w
        );
        this.warehousesChanged.emit(this.warehouses);
        console.log('Warehouse updated:', updatedData);
        this.resetForm();
      },
      error: (err) => {
        alert('Failed to update warehouse. Please try again.');
        console.error('Error updating warehouse:', err);
      }
    });
  }

  // Handle edit button click
  onEditClick(warehouse: warehouses): void {
    this.isEditing = true;
    this.showAddForm = true;
    this.editingWarehouseId = warehouse.id || null;
    this.warehouseForm = {
      name: warehouse.name,
      ville: warehouse.ville
    };
  }

  onDeleteWarehouse(id?: string): void {
    if (!id) {
      console.warn('Cannot delete warehouse without ID');
      return;
    }

    if (confirm('Are you sure you want to delete this warehouse?')) {
      this.warehousesService.deleteWarehouse(id).subscribe({
        next: () => {
          this.warehouses = this.warehouses.filter(w => w.id !== id);
          this.warehousesChanged.emit(this.warehouses);
          console.log('Warehouse deleted:', id);
        },
        error: (err) => {
          alert('Failed to delete warehouse. Please try again.');
          console.error('Error deleting warehouse:', err);
        }
      });
    }
  }

  // Reset form state
   resetForm(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.editingWarehouseId = null;
    this.warehouseForm = { name: '', ville: '' };
  }
}
