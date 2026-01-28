import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { PurchaseOrder } from '../purchase-order.model';
import { OrderLine } from '../models/order-line.model';

@Component({
  selector: 'app-po-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './po-form.component.html'
})
export class PoFormComponent implements OnInit {
  @Input() order?: PurchaseOrder;
  @Input() isEdit = false;
  @Output() save = new EventEmitter<PurchaseOrder>();
  @Output() cancel = new EventEmitter<void>();

  poForm!: FormGroup;
  orderLines: OrderLine[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    if (this.order && this.isEdit) {
      this.populateForm();
    }
  }

  initForm() {
    this.poForm = this.fb.group({
      supplierId: ['', Validators.required],
      createdByUserId: ['da3e580b-f78c-4d00-9c5f-11a6dcaa825a'],
      expectedDelivery: ['', Validators.required],
      status: [''],
      shippingAddress: [''],
      billingAddress: [''],
      notes: ['']
    });
  }

  populateForm() {
    if (this.order) {
      this.poForm.patchValue({
        supplierId: this.order.supplierId,
        createdByUserId: this.order.createdByUserId,
        expectedDelivery: this.order.expectedDelivery,
        status: this.order.status,
        shippingAddress: this.order.shippingAddress,
        billingAddress: this.order.billingAddress,
        notes: this.order.notes
      });
      this.orderLines = this.order.orderLines || [];
    }
  }

  addOrderLine() {
    const newLine: OrderLine = {
      productId: '',
      quantity: 1,
      unitPrice: 0
    };
    this.orderLines.push(newLine);
  }

  removeOrderLine(index: number) {
    this.orderLines.splice(index, 1);
  }

  onSubmit() {
    if (this.poForm.valid && this.orderLines.length > 0) {
      // Vérifier que tous les productId sont remplis
      const hasEmptyProduct = this.orderLines.some(line => !line.productId);
      
      if (hasEmptyProduct) {
        alert('Erreur: Tous les produits doivent avoir un ID');
        return;
      }

      // Vérifier que les prix sont > 0
      const hasInvalidPrice = this.orderLines.some(line => !line.unitPrice || line.unitPrice <= 0);
      if (hasInvalidPrice) {
        alert('Erreur: Le prix unitaire doit être supérieur à 0');
        return;
      }

      const formValue = this.poForm.value;
      const po: PurchaseOrder = {
        ...formValue,
        status: this.isEdit ? formValue.status : (formValue.status || 'DRAFT'),
        orderLines: this.orderLines,
        id: this.order?.id
      };
      console.log('Purchase Order à envoyer:', po);
      this.save.emit(po);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  parsePrice(value: string): number {
    return parseFloat(value) || 0;
  }
}
