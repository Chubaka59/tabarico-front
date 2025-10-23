import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class CdiGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isCDI() || this.authService.isResponsable() || this.authService.isRh() || this.authService.isPatron()) {
      return true;
    }
    this.router.navigate(['/forbidden']);
    return false;
  }
}
