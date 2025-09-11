import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {ProductModel} from '../../../core/models/Product.model';
import {StockTransactionModel} from '../../../core/models/stock-transaction.model';
import {StockManagementService} from '../../services/stock-management.service';
import {StockHistoryModel} from '../../../core/models/stock-history.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConsumableModel} from '../../../core/models/consumable.model';

@Component({
  selector: 'app-stock-management.component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.scss'
})
export class StockManagementComponent implements OnInit {
  stockForm: FormGroup;
  products: ProductModel[] = [];
  consumables: ConsumableModel[] = [];
  transactions: StockHistoryModel[] = []
  filteredTransactions: StockHistoryModel[] = [];
  isResponsable = false;

  displayedColumns = [
    'date', 'product', 'type', 'quantity', 'user'
  ];

  selectedProduct: ProductModel | null = null;
  selectedConsumable: ConsumableModel | null = null;
  filterDate: Date = new Date();

  constructor(private fb: FormBuilder,
              private stockService: StockManagementService,
              private snackBar: MatSnackBar) {
    this.stockForm = this.fb.group({
      product: [null, Validators.required],
      adjustment: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    const userRoles = localStorage.getItem('role') || '[]';
    this.isResponsable = userRoles.includes('Responsable');

    this.stockForm = this.fb.group({
      item: [null, Validators.required], // ✅ remplace product par item
      adjustment: [null, [Validators.required, Validators.min(-99999)]],
    });

    if (this.isResponsable) {
      this.loadProducts();
    }
    this.loadConsumables();
    this.loadTransactions();
  }

  /** Récupère les produits */
  loadProducts(): void {
    this.stockService.getProducts().subscribe({
      next: (data: ProductModel[]) => (this.products = data),
      error: (err) => {
        console.log("Erreur lors du chargement des produits", err);
        this.showError('Erreur chargement produits');
      },
    });
  }

  loadConsumables(): void {
    this.stockService.getConsumables().subscribe({
      next: (data: any[]) => this.consumables = data,
      error: () => this.showError('Erreur chargement consommables')
    });
  }

  /** Récupère l’historique */
  loadTransactions(): void {
    this.stockService.getTransactions(this.filterDate).subscribe({
      next: (data: StockHistoryModel[]) => {
        this.transactions = data;
        this.filteredTransactions = data;
      },
      error: (err) => {
        console.log("Erreur lors du chargement de l'historique", err);
        this.showError('Erreur chargement historique')
      },
    });
  }

  onItemChange(value: { type: 'product' | 'consumable'; id: number }): void {
    if (value.type === 'product') {
      this.selectedProduct = this.products.find(p => p.id === value.id) || null;
      this.selectedConsumable = null;
    } else {
      this.selectedConsumable = this.consumables.find(c => c.id === value.id) || null;
      this.selectedProduct = null;
    }
  }

  updateStock(): void {
    if (!this.stockForm.valid) return;

    const { adjustment } = this.stockForm.value;

    const transaction: StockTransactionModel = {
      productId: this.selectedProduct ? this.selectedProduct.id : undefined,
      consumableId: this.selectedConsumable ? this.selectedConsumable.id : undefined,
      quantity: adjustment
    };

    this.stockService.updateStock(transaction).subscribe({
      next: () => {
        this.showError('Stock mis à jour ✅');
        this.loadProducts();
        this.loadConsumables();
        this.loadTransactions();
        this.stockForm.reset();
        this.selectedProduct = null;
        this.selectedConsumable = null;
      },
      error: () => this.showError('Erreur mise à jour stock'),
    });
  }

  filterTransactions(): void {
    if (!this.filterDate) return;

    // Force la date locale pour éviter le décalage UTC
    const localDate = new Date(
      this.filterDate.getFullYear(),
      this.filterDate.getMonth(),
      this.filterDate.getDate()
    );

    this.stockService.getTransactions(localDate).subscribe({
      next: (data: StockHistoryModel[]) => {
        this.filteredTransactions = data;
      },
      error: () => this.showError('Erreur chargement historique'),
    });
  }

  movementLabels: { [key: string]: string } = {
    stockModification: 'Modification de stock',
    customerSale: 'Vente client'
  };

  getMovementLabel(value: string): string {
    return this.movementLabels[value] || value;
  }

  showError(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 4000,
      panelClass: ['error-snackbar']
    });
  }
}
