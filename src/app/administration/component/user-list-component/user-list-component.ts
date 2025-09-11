import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {UserModel} from '../../../core/models/user.model';
import {UserFormDialogComponent} from '../user-form-dialog.component/user-form-dialog.component';
import {UserListService} from '../../services/user-list.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list-component',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatSnackBarModule // ✅ ajout
  ],
  templateUrl: './user-list-component.html',
  styleUrls: ['./user-list-component.scss'],
})
export class UserListComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName', 'username', 'phone', 'role', 'identityCard', 'action'];
  dataSource = new MatTableDataSource<UserModel>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserListService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar // ✅ injection snackbar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: UserModel[]) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs', err);
        this.snackBar.open('❌ Erreur lors du chargement des utilisateurs', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCreateUser(): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers(); // 🔄 recharge la liste si un utilisateur a été créé
      }
    });
  }

  editUser(user: UserModel): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers(); // 🔄 recharge la liste si un utilisateur a été créé
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.snackBar.open('✅ Utilisateur supprimé', 'Fermer', {
            duration: 4000,
            panelClass: ['snackbar-success']
          });
        },
        error: (err: any) => {
          console.error('Erreur suppression utilisateur', err);
          this.snackBar.open('❌ Erreur lors de la suppression de l’utilisateur', 'Fermer', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        },
      });
    }
  }
}
