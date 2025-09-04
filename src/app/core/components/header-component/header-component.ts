import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [
    RouterLink
  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss'
})
export class HeaderComponent {
  openMenu: string | null = null;

  toggleMenu(menu: string) {
    this.openMenu = this.openMenu === menu ? null : menu;
  }
}
