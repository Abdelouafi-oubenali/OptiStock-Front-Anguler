import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
export class PoFormComponent implements OnInit, OnChanges {
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['order'] && this.order && this.isEdit && this.poForm) {
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
    console.log('populateForm appelée avec order:', this.order);
    
    if (this.order) {
      // Convertir la date expectedDelivery au format YYYY-MM-DD pour l'input date
      let dateFormatted = '';
      if (this.order.expectedDelivery) {
        const date = new Date(this.order.expectedDelivery);
        if (!isNaN(date.getTime())) {
          dateFormatted = date.toISOString().split('T')[0];
        }
      }

      const formData = {
        supplierId: this.order.supplierId || '',
        createdByUserId: this.order.createdByUserId || 'da3e580b-f78c-4d00-9c5f-11a6dcaa825a',
        expectedDelivery: dateFormatted,
        status: this.order.status || '',
        shippingAddress: this.order.shippingAddress || '',
        billingAddress: this.order.billingAddress || '',
        notes: this.order.notes || ''
      };

      console.log('Remplissage du formulaire avec:', formData);
      this.poForm.patchValue(formData);

      // Copier les lignes de commande avec toutes leurs informations
      this.orderLines = this.order.orderLines ? [...this.order.orderLines] : [];
      console.log('OrderLines copiées:', this.orderLines);
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
