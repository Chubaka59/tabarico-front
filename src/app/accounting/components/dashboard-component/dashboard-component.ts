import { Component, OnInit } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service'
import { DashboardModel } from '../../models/dashboard.model'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatInputModule
  ],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class DashboardComponent implements OnInit {
  headerRow1 = [
    'poste', 'username',
    'venteClientGroup',
    'venteGrossisteCayoGroup',
    'quota', 'quotaGrossiste',
    'primeActuelleGroup', 'primeS1Group',
    'avertissementsGroup',
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
    'vacances', 'dateRetour'   // déplacé en dernier
  ];




  dataSource = new MatTableDataSource<DashboardModel>([]);

  constructor(private dashboardService: DashboardService,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.dashboardService.getUserAccounting().subscribe({
      next: data => this.dataSource.data = data,
      error: err => {
        this.showError("Erreur lors du chargement des données 📡");
      }
    });
  }

  onToggleChange(user: DashboardModel) {
    this.dashboardService.updateUserAccounting(user).subscribe({
      error: (err) => this.showError("Erreur lors de la sauvegarde ❌")
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
          next: (updated) => console.log('Holiday sauvegardé ✅', updated),
          error: (err) => this.showError("Erreur lors de la sauvegarde ❌")
        });
      } else {
       this.showError("Veuillez renseigner une date de fin de congé 📅");
      }
    } else {
      // Cas où la case est décochée
      user.endOfHoliday = undefined;

      this.dashboardService.updateUserAccounting(user).subscribe({
        next: (updated) => console.log('Holiday supprimé ✅', updated),
        error: (err) => this.showError("Erreur lors de la suppression ❌")
      });
    }
  }

}
