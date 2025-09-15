import {Component, OnInit} from '@angular/core';
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
  MatTable
} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {CurrencyPipe, DatePipe, NgClass} from '@angular/common';
import {PersonalDashboardService} from '../../services/personal-dashboard.service';
import {CustomerSale} from '../../../core/models/customer-sales.model';
import {ExporterSale} from '../../../core/models/exporter-sales.model';
import {PersonalDashboardModel} from '../../../core/models/personal-dashboard.model';

@Component({
  selector: 'app-personnal-dashboard-component',
  standalone: true,
  imports: [
    DatePipe,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    CurrencyPipe,
    NgClass
  ],
  templateUrl: './personal-dashboard.component.html',
  styleUrl: './personal-dashboard.component.scss'
})
export class PersonalDashboardComponent implements OnInit {
  exporterDisplayedColumns: string[] = ['date', 'niveau', 'quantite', 'employeeAmount', 'companyAmount'];
  customerDisplayedColumns: string[] = ['date', 'produit', 'type', 'quantite', 'montant'];

  customerSales: CustomerSale[] = [];
  exporterSales: ExporterSale[] = [];

  // nouvelles propriétés pour alimenter les cartes
  cleanMoneySalary = 0;
  dirtyMoneySalary = 0;
  cleanMoneySalaryPreviousWeek = 0;
  dirtyMoneySalaryPreviousWeek = 0;
  quota = false;
  exporterQuota = false;
  topSellers: { name: string; quantity: number, reward: number }[] = [];

  constructor(
    private saleService: PersonalDashboardService
  ) {}

  ngOnInit(): void {
    this.saleService.getPersonalDashboardData().subscribe({
      next: (data: PersonalDashboardModel) => {
        // alimenter les tableaux
        this.customerSales = data.customerSaleDtoList;
        this.exporterSales = data.exporterSaleDtoList;
        // alimenter les cartes
        this.cleanMoneySalary = data.cleanMoneySalary;
        this.dirtyMoneySalary = data.dirtyMoneySalary;
        this.cleanMoneySalaryPreviousWeek = data.cleanMoneySalaryPreviousWeek;
        this.dirtyMoneySalaryPreviousWeek = data.dirtyMoneySalaryPreviousWeek;
        this.quota = data.quota;
        this.exporterQuota = data.exporterQuota;
        this.topSellers = data.topSellers;
        },
      error: err => console.error('Erreur de chargement des ventes', err)
    });
  }
}
