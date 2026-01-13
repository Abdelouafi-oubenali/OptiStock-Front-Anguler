export interface InventoryView {
  id?: string;
  qtyOnHand: number;
  qtyReserved: number;
  referenceDocument: string;
  productName: string;
  warehouseName: string;
}
