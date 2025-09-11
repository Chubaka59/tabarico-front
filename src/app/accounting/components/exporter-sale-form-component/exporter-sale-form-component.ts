import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {ExporterSaleService} from '../../services/exporter-sale.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-exporter-sale-form-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './exporter-sale-form-component.html',
  styleUrl: './exporter-sale-form-component.scss'
})
export class ExporterSaleFormComponent {
  exporterSaleForm: FormGroup;

  constructor(private fb: FormBuilder,
              private exporterSaleService: ExporterSaleService,
              private router: Router) {
    this.exporterSaleForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(1)]],
      level: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.exporterSaleForm.valid) {
      const { quantity, level } = this.exporterSaleForm.value;
      this.exporterSaleService.addExporterSale({ quantity, level }).subscribe({
        next: () => {
          alert('Vente exportateur ajoutée avec succès ✅');
          this.router.navigate(['/personalDashboard']);
        },
        error: err => console.error('Erreur lors de l’ajout de la vente exportateur', err)
      });
    }
  }
}
