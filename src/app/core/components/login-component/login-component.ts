import {Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login-component',
  imports: [
    FormsModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/personalDashboard']); // redirige après login
      },
      error: (err) => {
        if (err.status === 403) {
          this.errorMessage = 'Identifiants incorrects';
        } else {
          this.errorMessage = 'Erreur serveur. Réessayez plus tard.';
        }
      }
    });
  }


}
