export interface Supplier {
  id?: string;
  name: string;
  contactInfo: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SupplierFormData {
  name: string;
  contactInfo: string;
  active: boolean;
}
