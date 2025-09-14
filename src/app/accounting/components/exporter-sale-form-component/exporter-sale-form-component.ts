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


@Component({
  selector: 'app-exporter-sale-form-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './exporter-sale-form-component.html',
  styleUrl: './exporter-sale-form-component.scss'
})
export class ExporterSaleFormComponent implements OnInit {
  exporterSaleForm: FormGroup;
  users: any[] = [];

  constructor(private fb: FormBuilder,
              private exporterSaleService: ExporterSaleService,
              private userService: UserListService,
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
    // Charger la liste des utilisateurs au démarrage
    this.userService.getUsers().subscribe({
      next: data => this.users = data,
      error: err => console.error('Erreur chargement utilisateurs', err)
    });
  }

  isPatron(): boolean {
    return this.auth.isPatron();
  }
}
