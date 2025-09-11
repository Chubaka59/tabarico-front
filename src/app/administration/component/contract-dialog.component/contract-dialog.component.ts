import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import {ContractService} from '../../services/contract.service';
import {ContractModel} from '../../../core/models/contract.model';

@Component({
  selector: 'app-contract-dialog.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle
  ],
  templateUrl: './contract-dialog.component.html',
  styleUrl: './contract-dialog.component.scss'
})
export class ContractDialogComponent {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<ContractDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContractModel | null
  ) {
    this.form = this.fb.group({
      company: [data?.company || '', Validators.required],
      reduction: [data?.reduction || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const contract = this.form.value as ContractModel;
    const request$ = this.data
      ? this.contractService.update(this.data.id, contract)
      : this.contractService.create(contract);

    request$.subscribe({
      next: () => {
        this.snack.open(`Contrat ${this.data ? 'modifié' : 'créé'} avec succès`, 'Fermer', { duration: 4000 });
        this.dialogRef.close(true);
      },
      error: () => this.snack.open('Erreur lors de la sauvegarde du contrat', 'Fermer', { duration: 4000 }),
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
