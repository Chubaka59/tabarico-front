import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {UserListService} from '../../services/user-list.service';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

// ✅ Validator custom
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password && confirmPassword && password !== confirmPassword
    ? { mismatch: true }
    : null;
};

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatSnackBarModule // ✅ importer le module
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userListService: UserListService,
    private snackBar: MatSnackBar // ✅ injection snackbar
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMatchValidator });
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.snackBar.open('Veuillez remplir correctement le formulaire', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    const { password } = this.passwordForm.value;

    this.userListService.changePassword(password!).subscribe({
      next: () => {
        this.snackBar.open('✅ Mot de passe changé avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.passwordForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('❌ Erreur lors de la mise à jour', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
