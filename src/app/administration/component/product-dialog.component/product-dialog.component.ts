import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommonModule} from '@angular/common';
import {ProductService} from '../../services/product.service';
import {ProductModel} from '../../../core/models/Product.model';

@Component({
  selector: 'app-product-dialog.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle
  ],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss'
})
export class ProductDialogComponent {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductModel | null
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      cleanMoney: [data?.cleanMoney || 0, Validators.required],
      dirtyMoney: [data?.dirtyMoney || 0, Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const product = this.form.value as ProductModel;
    const request$ = this.data
      ? this.productService.update(this.data.id, product)
      : this.productService.create(product);

    request$.subscribe({
      next: () => {
        this.snack.open(`Produit ${this.data ? 'modifié' : 'créé'} avec succès`, 'Fermer', { duration: 4000 });
        this.dialogRef.close(true);
      },
      error: () => this.snack.open('Erreur lors de la sauvegarde du produit', 'Fermer', { duration: 4000 }),
    });
  }
  close(): void { this.dialogRef.close(false); }
}
