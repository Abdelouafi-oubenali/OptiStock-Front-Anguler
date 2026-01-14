import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuppliersService } from '../services/suppliers-service';
import { Supplier, SupplierFormData } from '../suppliers-component/supplier.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers-component.html',
  styleUrl: './suppliers-component.css'
})
export class SuppliersComponent implements OnInit {
  @Input() suppliers: Supplier[] = [];
  @Output() suppliersChanged = new EventEmitter<Supplier[]>();

  filteredSuppliers: Supplier[] = [];

  isLoading = true;
  errorMessage = '';
  darkMode = false;

  showModal = false;
  isEditMode = false;
  currentSupplierId = '';

  formData: SupplierFormData = {
    name: '',
    contactInfo: '',
    active: true
  };

  getEndIndex(): number {
    return Math.min(
      this.currentPage * this.itemsPerPage,
      this.filteredSuppliers.length
    );
  }

  getActiveSuppliersCount(): number {
    return this.suppliers.filter((s: Supplier) => s.active).length;
  }

  getInactiveSuppliersCount(): number {
    return this.suppliers.filter((s: Supplier) => !s.active).length;
  }

  Math = Math;

  searchQuery = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  currentPage = 1;
  itemsPerPage = 10;

  showConfirmDialog = false;
  supplierToDelete: Supplier | null = null;

  constructor(private suppliersService: SuppliersService) {}

  ngOnInit(): void {
    if (this.suppliers && this.suppliers.length > 0) {
      this.filteredSuppliers = [...this.suppliers];
      this.isLoading = false;
    } else {
      this.loadSuppliers();
    }

    this.checkDarkMode();
  }

  private checkDarkMode(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.darkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
  }

  loadSuppliers(): void {
    this.isLoading = true;
    this.suppliersService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.filteredSuppliers = [...data];
        this.applyFilters();
        this.isLoading = false;
        this.errorMessage = '';
        this.suppliersChanged.emit(this.suppliers);
      },
      error: (err) => {
        console.error('Error loading suppliers:', err);
        this.errorMessage = 'Failed to load suppliers. Please try again.';
        this.isLoading = false;
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.formData = {
      name: '',
      contactInfo: '',
      active: true
    };
    this.showModal = true;
  }

  openEditModal(supplier: Supplier): void {
    this.isEditMode = true;
    this.currentSupplierId = supplier.id || '';
    this.formData = {
      name: supplier.name,
      contactInfo: supplier.contactInfo,
      active: supplier.active
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      name: '',
      contactInfo: '',
      active: true
    };
    this.currentSupplierId = '';
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.updateSupplier();
    } else {
      this.createSupplier();
    }
  }

  createSupplier(): void {
    this.suppliersService.createSupplier(this.formData).subscribe({
      next: (newSupplier) => {
        this.suppliers.push(newSupplier);
        this.applyFilters();
        this.closeModal();
        this.showToast('Supplier created successfully!');
        this.suppliersChanged.emit(this.suppliers);
      },
      error: (err) => {
        console.error('Error creating supplier:', err);
        this.errorMessage = 'Failed to create supplier. Please try again.';
        this.showToast('Error creating supplier', 'error');
      }
    });
  }

  updateSupplier(): void {
    if (!this.currentSupplierId) return;

    this.suppliersService.updateSupplier(this.currentSupplierId, this.formData).subscribe({
      next: (updatedSupplier) => {
        const index = this.suppliers.findIndex(s => s.id === this.currentSupplierId);
        if (index !== -1) {
          this.suppliers[index] = updatedSupplier;
        }
        this.applyFilters();
        this.closeModal();
        this.showToast('Supplier updated successfully!');
        this.suppliersChanged.emit(this.suppliers);
      },
      error: (err) => {
        console.error('Error updating supplier:', err);
        this.errorMessage = 'Failed to update supplier. Please try again.';
        this.showToast('Error updating supplier', 'error');
      }
    });
  }

  confirmDelete(supplier: Supplier): void {
    this.supplierToDelete = supplier;
    this.showConfirmDialog = true;
  }

  deleteSupplier(): void {
    if (!this.supplierToDelete?.id) return;

    this.suppliersService.deleteSupplier(this.supplierToDelete.id).subscribe({
      next: () => {
        this.suppliers = this.suppliers.filter(s => s.id !== this.supplierToDelete?.id);
        this.applyFilters();
        this.closeConfirmDialog();
        this.showToast('Supplier deleted successfully!');
        this.suppliersChanged.emit(this.suppliers);
      },
      error: (err) => {
        console.error('Error deleting supplier:', err);
        this.errorMessage = 'Failed to delete supplier. Please try again.';
        this.closeConfirmDialog();
        this.showToast('Error deleting supplier', 'error');
      }
    });
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.supplierToDelete = null;
  }

  toggleStatus(supplier: Supplier): void {
    if (!supplier.id) return;

    const newStatus = !supplier.active;
    this.suppliersService.toggleSupplierStatus(supplier.id, newStatus).subscribe({
      next: (updatedSupplier) => {
        const index = this.suppliers.findIndex(s => s.id === supplier.id);
        if (index !== -1) {
          this.suppliers[index] = updatedSupplier;
        }
        this.applyFilters();
        this.showToast(`Supplier ${newStatus ? 'activated' : 'deactivated'}!`);
        this.suppliersChanged.emit(this.suppliers);
      },
      error: (err) => {
        console.error('Error toggling status:', err);
        this.errorMessage = 'Failed to update status. Please try again.';
        this.showToast('Error updating status', 'error');
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilterChange(filter: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = filter;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.suppliers];

    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      result = result.filter(s => s.active === isActive);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.contactInfo.toLowerCase().includes(query)
      );
    }

    this.filteredSuppliers = result;
  }

  get paginatedSuppliers(): Supplier[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSuppliers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSuppliers.length / this.itemsPerPage);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getStatusClass(active: boolean): string {
    if (this.darkMode) {
      return active
        ? 'bg-green-900/30 text-green-300'
        : 'bg-red-900/30 text-red-300';
    } else {
      return active
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800';
    }
  }

  getStatusText(active: boolean): string {
    return active ? 'Active' : 'Inactive';
  }

  formatDate(dateString?: Date): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  refreshData(): void {
    this.loadSuppliers();
  }

  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
      type === 'success'
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }

  trackById(index: number, supplier: Supplier): string {
    return supplier.id || index.toString();
  }

  get bgClass(): string {
    return this.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  }

  get cardBg(): string {
    return this.darkMode ? 'bg-gray-800' : 'bg-white';
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

  isFormValid(): boolean {
    return this.formData.name.trim() !== '' &&
      this.formData.contactInfo.trim() !== '';
  }

  extractEmail(contactInfo: string): string {
    const emailMatch = contactInfo.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return emailMatch ? emailMatch[0] : '';
  }

  extractPhone(contactInfo: string): string {
    const phoneMatch = contactInfo.match(/[\d\s\-\+\(\)]{8,}/);
    return phoneMatch ? phoneMatch[0].trim() : '';
  }

  copyContactInfo(info: string): void {
    navigator.clipboard.writeText(info).then(() => {
      this.showToast('Contact info copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
}
