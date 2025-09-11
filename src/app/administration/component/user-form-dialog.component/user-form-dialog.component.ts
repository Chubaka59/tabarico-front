import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../core/models/user.model';
import { UserListService } from '../../services/user-list.service';
import { RoleModel } from '../../../core/models/role.model';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogTitle,
    MatSnackBarModule // ✅ ajout snackbar
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss']
})
export class UserFormDialogComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean;
  roles: RoleModel[] = [];
  identityFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    private userService: UserListService,
    private snackBar: MatSnackBar, // ✅ injection snackbar
    @Inject(MAT_DIALOG_DATA) public data: UserModel | null
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.userService.getRoles().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => {
        console.error('Erreur récupération rôles', err);
        this.snackBar.open('❌ Erreur lors du chargement des rôles', 'Fermer', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      },
    });

    this.userForm = this.fb.group({
      firstName: [this.data?.firstName || '', Validators.required],
      lastName: [this.data?.lastName || '', Validators.required],
      username: [this.data?.username || '', Validators.required],
      phone: [this.data?.phone || ''],
      role: [this.data?.role?.id || '', Validators.required],
      password: ['', this.isEditMode ? [] : Validators.required],
      identityCard: [this.data?.identityCardImage || '']
    });
  }

  createUser(): void {
    if (this.userForm.invalid) return;

    const formData = this.buildFormData();

    this.userService.createUser(formData).subscribe({
      next: () => {
        this.snackBar.open('✅ Utilisateur créé avec succès', 'Fermer', {
          duration: 4000,
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        console.error('Erreur sauvegarde utilisateur', err);
        this.snackBar.open('❌ Erreur lors de la création de l’utilisateur', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      },
    });
  }

  updateUser(): void {
    if (this.userForm.invalid) return;
    if (!this.data || typeof this.data.id !== 'number') {
      this.snackBar.open('❌ ID utilisateur manquant', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    const formData = this.buildFormData();

    this.userService.updateUser(this.data?.id, formData).subscribe({
      next: () => {
        this.snackBar.open('✅ Utilisateur modifié avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        console.error('Erreur sauvegarde utilisateur', err);
        this.snackBar.open('❌ Erreur lors de la mise à jour de l’utilisateur', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.identityFile = input.files[0];
    }
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('firstName', this.userForm.value.firstName);
    formData.append('lastName', this.userForm.value.lastName);
    formData.append('username', this.userForm.value.username);
    formData.append('phone', this.userForm.value.phone);
    formData.append('role', this.userForm.value.role);

    if (this.userForm.value.password) {
      formData.append('password', this.userForm.value.password);
    }

    if (this.identityFile) {
      formData.append('identityCard', this.identityFile, this.identityFile.name);
    }

    return formData;
  }
}
