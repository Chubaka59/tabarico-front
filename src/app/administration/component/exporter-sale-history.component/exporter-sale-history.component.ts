import {Component, OnInit, ViewChild} from '@angular/core';
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
import {ExporterSale} from '../../../core/models/exporter-sales.model';
import {ExporterSalesService} from '../../services/exporter-sales.service';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-exporter-sale-history.component',
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
  templateUrl: './exporter-sale-history.component.html',
  styleUrl: './exporter-sale-history.component.scss'
})
export class ExporterSaleHistoryComponent implements OnInit {
  displayedColumns: string[] = ['date', 'user', 'quantity', 'level', 'employeeAmount', 'companyAmount', 'action'];
  dataSource: MatTableDataSource<ExporterSale> = new MatTableDataSource();

  filterDate: Date = new Date();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private salesService: ExporterSalesService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.filterByDate();
  }

  filterByDate(): void {
    this.salesService.getSales(this.filterDate).subscribe({
      next: (data: ExporterSale[]) => {
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
