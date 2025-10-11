import {Component, OnInit} from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {DashboardService} from '../../services/dashboard.service'
import {DashboardModel} from '../../../core/models/dashboard.model'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButton} from '@angular/material/button';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD-MM-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-dashboard-component',
  imports: [
    CommonModule,
    MatTableModule,
    MatSlideToggleModule,
    FormsModule,
    CurrencyPipe,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButton
  ],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class DashboardComponent implements OnInit {
  salesBlocked = false;
  headerRow1 = [
    'poste', 'username',
    'venteClientGroup',
    'venteGrossisteCayoGroup',
    'quota', 'quotaGrossiste',
    'primeActuelleGroup', 'primeS1Group',
    'avertissementsGroup',
    'dateOfHire',
    'vacances', 'dateRetour'   // déplacé en dernier
  ];

  headerRow2 = [
    'venteClientPropre', 'venteClientSale',
    'venteGrossistePrimeEntreprise', 'venteGrossisteQuantite',
    'primeActuellePropre', 'primeActuelleSale',
    'primeS1Propre', 'primeS1Sale',
    'avertissement1', 'avertissement2'
    // pas besoin de dateRetour ni vacances ici car rowspan=2
  ];

  displayedColumns = [
    'poste', 'username',
    'venteClientPropre', 'venteClientSale',
    'venteGrossistePrimeEntreprise', 'venteGrossisteQuantite',
    'quota', 'quotaGrossiste',
    'primeActuellePropre', 'primeActuelleSale',
    'primeS1Propre', 'primeS1Sale',
    'avertissement1', 'avertissement2',
    'dateOfHire',
    'vacances', 'dateRetour'   // déplacé en dernier
  ];




  dataSource = new MatTableDataSource<DashboardModel>([]);

  constructor(private dashboardService: DashboardService,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadData();
    this.loadSalesBlocked();
  }

  private loadData(): void {
    this.dashboardService.getUserAccounting().subscribe({
      next: data => this.dataSource.data = data,
      error: () => this.showError("Erreur lors du chargement des données 📡")
    });
  }

  loadSalesBlocked(): void {
    this.dashboardService.getSalesBlocked().subscribe({
      next: (blocked: boolean) => this.salesBlocked = blocked,
      error: err => console.error('Erreur récupération état blocage ventes', err)
    });
  }

  onToggleChange(user: DashboardModel) {
    this.dashboardService.updateUserAccounting(user).subscribe({
      next: () => this.loadData(), // 🔄 recharge
      error: () => this.showError("Erreur lors de la sauvegarde ❌")
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 4000,
      panelClass: ['error-snackbar']
    });
  }

  onHolidayChange(user: DashboardModel) {
    if (user.holiday) {
      // Cas où la case est cochée
      if (user.endOfHoliday) {
        const today = new Date();
        const selectedDate = new Date(user.endOfHoliday);

        if (selectedDate <= today) {
          this.showError("La date doit être dans le futur 🚫");
          return;
        }

        this.dashboardService.updateUserAccounting(user).subscribe({
          error: (err) => {
            console.log("Erreur lors de la mise à jour de la compta", err);
            this.showError("Erreur lors de la sauvegarde ❌");
          }
        });
      } else {
        this.showError("Veuillez renseigner une date de fin de congé 📅");
      }
    } else {
      // Cas où la case est décochée
      user.endOfHoliday = undefined;

      this.dashboardService.updateUserAccounting(user).subscribe({
        error: (err) => {
          console.log("Erreur lors de la mise à jour de la compta", err);
          this.showError("Erreur lors de la suppression ❌");
        }
      });
    }
  }

  resetCompta(): void {
    if (confirm('Voulez-vous vraiment reset la compta ?')) {
      this.dashboardService.resetAccounting().subscribe({
        next: () => {
          this.snackBar.open("Compta réinitialisée ✅", 'Fermer', {duration: 4000});
          this.loadData(); // 🔄 recharge la table
        },
        error: () => this.showError("Erreur lors de la réinitialisation ❌")
      });
    }
  }

  onSalesBlockChange(event: any) {
    this.dashboardService.setSalesBlocked(this.salesBlocked).subscribe({
      next: () => {
        const message = this.salesBlocked
          ? '❌ Les ventes sont maintenant bloquées'
          : '✅ Les ventes sont maintenant autorisées';
        this.snackBar.open(message, 'Fermer', {
          duration: 4000,
          panelClass: this.salesBlocked ? ['snackbar-error'] : ['snackbar-success']
        });
      },
      error: err => {
        console.error('Erreur lors du blocage des ventes', err);
        this.snackBar.open('⚠️ Impossible de modifier le blocage des ventes', 'Fermer', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  getRowClass(user: DashboardModel): string {
    switch (user.roleName?.toLowerCase()) {
      case 'cdi':
        return 'role-cdi';
      case 'patron':
      case 'patrons':
        return 'role-patron';
      case 'responsable':
      case 'responsables':
        return 'role-responsable';
      case 'cdd':
        return 'role-cdd';
      default:
        return '';
    }
  }

  get totalCleanSalary(): number {
    return this.dataSource.data.reduce((sum, u) => sum + (u.cleanMoneySalary || 0), 0);
  }

  get totalDirtySalary(): number {
    return this.dataSource.data.reduce((sum, u) => sum + (u.dirtyMoneySalary || 0), 0);
  }

  get totalEmployees(): number {
    return this.dataSource?.data?.length || 0;
  }
}
