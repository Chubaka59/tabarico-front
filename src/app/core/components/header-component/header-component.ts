import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-header-component',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss'
})
export class HeaderComponent implements OnInit {
  openMenu: string | null = null;
  userName: string | null = null;

  constructor(private auth: AuthService,
              private router: Router) {}

  toggleMenu(menu: string) {
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  ngOnInit() {
    const user = this.auth.getUserInfo();
    if (user) {
      this.userName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.username;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']); // redirige manuellement
  }

  isPatron(): boolean {
    return this.auth.isPatron();
  }

  isRh() {
    return this.auth.isRh() || this.isPatron();
  }

  isResponsable(): boolean {
    return this.auth.isResponsable() || this.isRh();
  }

  isCDI(): boolean {
    return this.auth.isCDI() || this.isResponsable();
  }
}
