import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommonModule} from '@angular/common';
import {RoleModel} from '../../../core/models/role.model';
import {RoleService} from '../../services/role.service';

@Component({
  selector: 'app-role-dialog.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle
  ],
  templateUrl: './role-dialog.component.html',
  styleUrl: './role-dialog.component.scss'
})

export class RoleDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoleModel | null
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      redistributionRate: [data?.redistributionRate || 0, [Validators.required, Validators.min(0)]],
      salary: [data?.salary || 0, [Validators.required, Validators.min(0)]],
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const role = this.form.value as RoleModel;
    const request$ = this.data
      ? this.roleService.update(this.data.id, role)
      : this.roleService.create(role);

    request$.subscribe({
      next: () => {
        this.snack.open(`Rôle ${this.data ? 'modifié' : 'créé'} avec succès`, 'Fermer', { duration: 4000 });
        this.dialogRef.close(true);
      },
      error: () => this.snack.open('Erreur lors de la sauvegarde du rôle', 'Fermer', { duration: 4000 }),
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
