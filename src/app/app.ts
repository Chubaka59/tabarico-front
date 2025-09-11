import {Component, signal} from '@angular/core';
import {HeaderComponent} from './core/components/header-component/header-component';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(public router: Router) {}
  protected readonly title = signal('tabarico-front');

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
