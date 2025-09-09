import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import {ProductModel} from '../../../core/models/Product.model';
import {StockTransactionModel} from '../../../core/models/stock-transaction.model';
import {StockManagementService} from '../../services/stock-management.service';
import {StockHistoryModel} from '../../../core/models/stock-history.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  transactions: StockHistoryModel[] = []
  filteredTransactions: StockHistoryModel[] = [];

  displayedColumns = [
    'date', 'product', 'type', 'quantity', 'user'
  ];

  selectedProduct: ProductModel | null = null;
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
    this.stockForm = this.fb.group({
      product: [null, Validators.required],
      adjustment: [null, [Validators.required, Validators.min(-99999)]],
    });

    this.loadProducts();
    this.loadTransactions();
  }

  /** Récupère les produits */
  loadProducts(): void {
    this.stockService.getProducts().subscribe({
      next: (data: ProductModel[]) => (this.products = data),
      error: (err: any) => this.showError('Erreur chargement produits'),
    });
  }

  /** Récupère l’historique */
  loadTransactions(): void {
    this.stockService.getTransactions(this.filterDate).subscribe({
      next: (data: StockHistoryModel[]) => {
        this.transactions = data;
        this.filteredTransactions = data;
      },
      error: (err: any) => this.showError('Erreur chargement historique'),
    });
  }

  onProductChange(productId: number): void {
    this.selectedProduct = this.products.find((p) => p.id === productId) || null;
  }

  updateStock(): void {
    if (!this.stockForm.valid) {
      return;
    }

    const { product, adjustment } = this.stockForm.value;

    // Création d'une transaction conforme au modèle
    const transaction: StockTransactionModel = {
      productId: product,
      quantity: adjustment
    };

    console.log(transaction);

    this.stockService.updateStock(transaction).subscribe({
      next: (saved: StockTransactionModel) => {
        this.showError('Stock mis à jour ✅');
        this.loadProducts();
        this.loadTransactions();
        this.stockForm.reset();
        this.selectedProduct = null;
        this.filterTransactions();
      },
      error: (err: any) => this.showError('Erreur mise à jour stock'),
    });
  }

  filterTransactions(): void {
    this.loadTransactions(); // recharge depuis le back avec la nouvelle date
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
