import { Component, signal } from '@angular/core';
import {HeaderComponent} from './core/components/header-component/header-component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('tabarico-front');
}
