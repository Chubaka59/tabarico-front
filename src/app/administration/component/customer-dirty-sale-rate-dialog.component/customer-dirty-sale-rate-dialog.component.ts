import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommonModule} from '@angular/common';
import {CustomerDirtySaleRateService} from '../../services/customer-dirty-sale-rate.service';
import {CustomerDirtySaleRateModel} from '../../../core/models/customer-dirty-sale-rate.model';

@Component({
  selector: 'app-customer-dirty-sale-rate-dialog.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle
  ],
  templateUrl: './customer-dirty-sale-rate-dialog.component.html',
  styleUrl: './customer-dirty-sale-rate-dialog.component.scss'
})
export class CustomerDirtySaleRateDialogComponent {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private customerDirtySaleRateService: CustomerDirtySaleRateService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<CustomerDirtySaleRateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomerDirtySaleRateModel
  ) {
    this.form = this.fb.group({
      customerDirtySaleRate: [data?.customerDirtySaleRate || 0, Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const customerDirtySaleRate = this.form.value as CustomerDirtySaleRateModel;
    const request$ = this.data
      ? this.customerDirtySaleRateService.update(this.data.id, customerDirtySaleRate)
      : this.customerDirtySaleRateService.create(customerDirtySaleRate);

    request$.subscribe({
      next: () => {
        this.snack.open(`Taux vente client sale ${this.data ? 'modifié' : 'créé'} avec succès`, 'Fermer', { duration: 4000 });
        this.dialogRef.close(true);
      },
      error: () => this.snack.open('Erreur lors de la sauvegarde du produit', 'Fermer', { duration: 4000 }),
    });
  }

  close(): void { this.dialogRef.close(false); }
}
