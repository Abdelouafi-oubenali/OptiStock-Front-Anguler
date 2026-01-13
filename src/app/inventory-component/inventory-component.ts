import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryDataLoding } from './inventory.model';
import {InventoryView} from './inventory-view.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-component.html'
})
export class InventoryComponent {
  @Input() inventory: InventoryDataLoding[] = [];
  @Input() inventories: InventoryView[] = [];
}
