import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import {ContractService} from '../../services/contract.service';
import {ContractModel} from '../../../core/models/contract.model';
import {ConsumableService} from '../../services/consumable.service';
import {ConsumableModel} from '../../../core/models/consumable.model';

@Component({
  selector: 'app-consumable-dialog.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './consumable-dialog.component.html',
  styleUrl: './consumable-dialog.component.scss'
})
export class ConsumableDialogComponent {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private consumableService: ConsumableService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<ConsumableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConsumableModel | null
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const consumable = this.form.value as ConsumableModel;
    const request$ = this.data
      ? this.consumableService.update(this.data.id, consumable)
      : this.consumableService.create(consumable);

    request$.subscribe({
      next: () => {
        this.snack.open(`Consommable ${this.data ? 'modifié' : 'créé'} avec succès`, 'Fermer', { duration: 4000 });
        this.dialogRef.close(true);
      },
      error: () => this.snack.open('Erreur lors de la sauvegarde du consommable', 'Fermer', { duration: 4000 }),
    });
  }
  close(): void { this.dialogRef.close(false); }
}
