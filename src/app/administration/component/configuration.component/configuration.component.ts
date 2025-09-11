import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {RoleModel} from '../../../core/models/role.model';
import {ContractModel} from '../../../core/models/contract.model';
import {ProductModel} from '../../../core/models/Product.model';
import {ConsumableModel} from '../../../core/models/consumable.model';
import {CustomerDirtySaleRateModel} from '../../../core/models/customer-dirty-sale-rate.model';
import {RoleService} from '../../services/role.service';
import {ProductService} from '../../services/product.service';
import {ContractService} from '../../services/contract.service';
import {CustomerDirtySaleRateService} from '../../services/customer-dirty-sale-rate.service';
import {ConsumableService} from '../../services/consumable.service';
import {MatDialog} from '@angular/material/dialog';
import {RoleDialogComponent} from '../role-dialog.component/role-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ContractDialogComponent} from '../contract-dialog.component/contract-dialog.component';
import {ProductDialogComponent} from '../product-dialog.component/product-dialog.component';
import {
  CustomerDirtySaleRateDialogComponent
} from '../customer-dirty-sale-rate-dialog.component/customer-dirty-sale-rate-dialog.component';
import {ConsumableDialogComponent} from '../consumable-dialog.component/consumable-dialog.component';

@Component({
  selector: 'app-configuration.component',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent implements OnInit {
  roles: RoleModel[] = [];
  contrats: ContractModel[] = [];
  produits: ProductModel[] = [];
  consommables: ConsumableModel[] = [];
  customerDirtySaleRate: CustomerDirtySaleRateModel[] = [];

  constructor(
    private roleService: RoleService,
    private produitService: ProductService,
    private contratService: ContractService,
    private customerDirtySaleRateService: CustomerDirtySaleRateService,
    private consumableService: ConsumableService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadProduits();
    this.loadContrats();
    this.loadCustomerDirtySaleRates();
    this.loadConsumables();
  }

  // === LOAD DATA ===
  loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('Erreur chargement rôles', err)
    });
  }

  loadProduits(): void {
    this.produitService.getAll().subscribe({
      next: (data) => this.produits = data,
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  loadContrats(): void {
    this.contratService.getAll().subscribe({
      next: (data) => this.contrats = data,
      error: (err) => console.error('Erreur chargement contrats', err)
    });
  }

  loadCustomerDirtySaleRates(): void {
    this.customerDirtySaleRateService.getAll().subscribe({
      next: (data) => this.customerDirtySaleRate = data,
      error: (err) => console.error('Erreur chargement config', err)
    });
  }

  loadConsumables(): void {
    this.consumableService.getAll().subscribe({
      next: (data) => this.consommables = data,
      error: (err) => console.error('Erreur chargement consommables', err)
    });
  }

  // === ACTIONS ===
  editRole(role: RoleModel) {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '450px',
      data: role
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }
  deleteRole(role: RoleModel) {
    if (!confirm(`Voulez-vous vraiment supprimer le rôle "${role.name}" ?`)) {
      return;
    }

    this.roleService.delete(role.id).subscribe({
      next: () => {
        this.snack.open('Rôle supprimé avec succès', 'Fermer', { duration: 4000 });
        this.loadRoles();
      },
      error: (err) => {
        console.error('Erreur suppression rôle', err);
        this.snack.open('Erreur lors de la suppression du rôle', 'Fermer', { duration: 4000 });
      }
    });
  }



  addContract() {
    const dialogRef = this.dialog.open(ContractDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadContrats();
      }
    });
  }
  editContract(contract: ContractModel) {
    const dialogRef = this.dialog.open(ContractDialogComponent, {
      width: '450px',
      data: contract
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadContrats();
      }
    });
  }
  deleteContract(contract: ContractModel) {
    if (!confirm(`Voulez-vous vraiment supprimer le Contrat "${contract.company}" ?`)) {
      return;
    }

    this.contratService.delete(contract.id).subscribe({
      next: () => {
        this.snack.open('Contrat supprimé avec succès', 'Fermer', { duration: 4000 });
        this.loadContrats();
      },
      error: (err) => {
        console.error('Erreur suppression contrat', err);
        this.snack.open('Erreur lors de la suppression du contrat', 'Fermer', { duration: 4000 });
      }
    });
  }

  editProduct(product: ProductModel) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '450px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProduits();
      }
    });
  }

  editCustomerDirtySaleRateModel(customerDirtySaleRate: CustomerDirtySaleRateModel) {
    const dialogRef = this.dialog.open(CustomerDirtySaleRateDialogComponent, {
      width: '450px',
      data: customerDirtySaleRate
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCustomerDirtySaleRates();
      }
    });
  }

  addConsumable() {
    const dialogRef = this.dialog.open(ConsumableDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadConsumables();
      }
    });
  }
  editConsumable(cons: ConsumableModel) {
    const dialogRef = this.dialog.open(ConsumableDialogComponent, {
      width: '450px',
      data: cons
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadConsumables();
      }
    });
  }
  deleteConsumable(cons: ConsumableModel) {
    if (!confirm(`Voulez-vous vraiment supprimer le Consommable "${cons.name}" ?`)) {
      return;
    }

    this.consumableService.delete(cons.id).subscribe({
      next: () => {
        this.snack.open('Consommable supprimé avec succès', 'Fermer', { duration: 4000 });
        this.loadConsumables();
      },
      error: (err) => {
        console.error('Erreur suppression contrat', err);
        this.snack.open('Erreur lors de la suppression du consommable', 'Fermer', { duration: 4000 });
      }
    });
  }
}
