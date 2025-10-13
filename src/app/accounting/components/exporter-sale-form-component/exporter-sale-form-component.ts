import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {ExporterSaleService} from '../../services/exporter-sale.service';
import {Router} from '@angular/router';
import {UserListService} from '../../../administration/services/user-list.service';
import {MatSelectModule} from '@angular/material/select';
import {AuthService} from '../../../core/services/auth.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {DashboardService} from '../../services/dashboard.service';
import {MatCard} from '@angular/material/card';


@Component({
  selector: 'app-exporter-sale-form-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCard
  ],
  templateUrl: './exporter-sale-form-component.html',
  styleUrl: './exporter-sale-form-component.scss'
})
export class ExporterSaleFormComponent implements OnInit {
  exporterSaleForm: FormGroup;
  users: any[] = [];
  salesBlocked = false;
  totalEmploye: number | null = null;
  totalEntreprise: number | null = null;

  constructor(private fb: FormBuilder,
              private exporterSaleService: ExporterSaleService,
              private userService: UserListService,
              private dashboardService: DashboardService,
              private auth: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.exporterSaleForm = this.fb.group({
      userId: [null],
      quantity: ['', [Validators.required, Validators.min(1)]],
      level: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.exporterSaleForm.valid) {
      const { userId, quantity, level } = this.exporterSaleForm.value;
      this.exporterSaleService.addExporterSale({ userId, quantity, level }).subscribe({
        next: () => {
          alert('Vente exportateur ajoutée avec succès ✅');
          this.router.navigate(['/personalDashboard']);
        },
        error: err => {
          console.error('Erreur lors de l’ajout de la vente exportateur', err);
          this.snackBar.open('❌ Erreur lors de l’ajout de la vente exportateur', 'Fermer', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  }

  ngOnInit(): void {
    // Récupérer l'état du blocage des ventes depuis le backend
    this.dashboardService.getSalesBlocked().subscribe({
      next: blocked => {
        this.salesBlocked = blocked;
        if (blocked) {
          this.snackBar.open('❌ Les ventes sont actuellement bloquées', 'Fermer', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        }
      },
      error: err => console.error('Erreur récupération état ventes bloquées', err)
    });

    // Charger la liste des utilisateurs
    this.userService.getUsers().subscribe({
      next: data => this.users = data,
      error: err => console.error('Erreur chargement utilisateurs', err)
    });

    // 🔥 Écouter les changements sur quantity et level
    this.exporterSaleForm.get('quantity')?.valueChanges.subscribe(() => this.updateTotals());
    this.exporterSaleForm.get('level')?.valueChanges.subscribe(() => this.updateTotals());
  }

  isPatron(): boolean {
    return this.auth.isPatron();
  }

  private updateTotals(): void {
    const quantity = this.exporterSaleForm.get('quantity')?.value;
    const level = this.exporterSaleForm.get('level')?.value;

    if (quantity && level && quantity > 0 && level > 0) {
      // Calcul total employé
      const base = 51;
      const totalEmployeRaw = (base + (base * (level * 0.3 / 100))) * quantity;
      const totalEmploye = Math.round(totalEmployeRaw); // arrondi standard

      // Calcul total entreprise
      const totalEntrepriseRaw = totalEmploye * 0.3;
      const totalEntreprise = Math.round(totalEntrepriseRaw);

      this.totalEmploye = totalEmploye;
      this.totalEntreprise = totalEntreprise;
    } else {
      this.totalEmploye = null;
      this.totalEntreprise = null;
    }
  }
}
