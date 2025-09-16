import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { RewardService } from '../../services/reward.service';
import { RewardModel } from '../../../core/models/reward.model';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-reward-dialog.component',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatInput,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './reward-dialog.component.html',
  styleUrl: './reward-dialog.component.scss'
})
export class RewardDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private rewardService: RewardService,
    private dialogRef: MatDialogRef<RewardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RewardModel | null
  ) {
    this.form = this.fb.group({
      amount: [data?.amount || 0, [Validators.required, Validators.min(0)]],
    });
  }

  save() {
    const reward: RewardModel = {
      ...this.data, // garde id + position
      ...this.form.value, // remplace uniquement le montant
    };

    this.rewardService.update(reward).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Erreur mise à jour récompense', err),
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
