import {Component, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';
import {CustomerSale} from '../../../core/models/customer-sales.model';
import {CustomerSalesService} from '../../services/customer-sales.service';

@Component({
  selector: 'app-customer-sale-history.component',
  imports: [
    CurrencyPipe,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatFormFieldModule,
    MatInput,
    MatTable,
    MatSort,
    DatePipe,
    MatCellDef,
    MatHeaderCellDef,
    MatButton,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatDatepickerInput,
    FormsModule,
    MatDatepickerToggle,
    MatDatepicker
  ],
  templateUrl: './customer-sale-history.component.html',
  styleUrl: './customer-sale-history.component.scss'
})
export class CustomerSaleHistoryComponent {
  displayedColumns: string[] = [
    'date',
    'product',
    'typeOfSale',
    'quantity',
    'contract',
    'amount',
    'user',
    'action'
  ];

  dataSource: MatTableDataSource<CustomerSale> = new MatTableDataSource();

  filterDate: Date = new Date();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private salesService: CustomerSalesService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.filterByDate();
  }

  filterByDate(): void {
    this.salesService.getSales(this.filterDate).subscribe({
      next: (data: CustomerSale[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      },
      error: () => this.snackBar.open('Erreur chargement des ventes', 'Fermer', { duration: 3000 })
    });
  }

  deleteSale(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cette vente ?')) return;

    this.salesService.deleteSale(id).subscribe({
      next: () => {
        this.snackBar.open('Vente supprimée', 'Fermer', { duration: 3000 });
        this.filterByDate(); // recharge après suppression
      },
      error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
    });
  }
}
