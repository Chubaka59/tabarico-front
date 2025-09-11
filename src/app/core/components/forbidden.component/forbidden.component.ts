import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-forbidden.component',
  imports: [
    MatButton,
    RouterLink
  ],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {

}
