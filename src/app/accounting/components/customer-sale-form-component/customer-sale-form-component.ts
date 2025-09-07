import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CustomerSaleService } from '../../services/customer-sale.service';
import { AuthService } from '../../../core/services/auth.service';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {ProductModel} from '../../models/Product.model';
import {ContractModel} from '../../models/contract.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-customer-sale-form-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckbox
  ],
  templateUrl: './customer-sale-form-component.html',
  styleUrl: './customer-sale-form-component.scss'
})
export class CustomerSaleFormComponent implements OnInit {
  clientSaleForm!: FormGroup;

  products: ProductModel[] = [];
  saleTypes: { key: string, label: string }[] = [];
  contracts: ContractModel[] = [];
  calculated = false;

  constructor(
    private fb: FormBuilder,
    private customerSaleService: CustomerSaleService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientSaleForm = this.fb.group({
      product: ['', Validators.required],
      typeOfSale: ['', Validators.required],
      contract: [null],
      calculateByPrice: [false],
      quantity: [0, [Validators.min(1), Validators.pattern(/^\d+$/)]],
      price: [0, [Validators.min(1), Validators.pattern(/^\d+$/)]]
    });

    // Charger les données backend
    this.loadProducts();
    this.loadSaleTypes();
    this.loadContracts();

    // 👉 Désactiver contrat si typeOfSale = dirtyMoney
    this.clientSaleForm.get('typeOfSale')?.valueChanges.subscribe((type: string) => {
      const contractControl = this.clientSaleForm.get('contract');

      if (type === 'dirtyMoney') {
        contractControl?.disable({ emitEvent: false });
        contractControl?.setValue(null, { emitEvent: false });
      } else {
        contractControl?.enable({ emitEvent: false });
      }
    });

    // État initial des champs
    this.toggleInputs(this.clientSaleForm.get('calculateByPrice')!.value);

    // Verrouiller/déverrouiller quand la checkbox change
    this.clientSaleForm.get('calculateByPrice')!.valueChanges.subscribe((calcByPrice: boolean) => {
      this.toggleInputs(calcByPrice);
    });

    // 🔄 Dès qu’un champ pertinent change → reset le flag "calculated"
    this.clientSaleForm.valueChanges.subscribe(() => {
      this.calculated = false;
    });
  }

  // Active/désactive les contrôles
  private toggleInputs(calcByPrice: boolean) {
    const qtyCtrl = this.clientSaleForm.get('quantity')!;
    const priceCtrl = this.clientSaleForm.get('price')!;

    if (calcByPrice) {
      // On saisit le PRIX → on verrouille la QUANTITÉ
      qtyCtrl.disable({ emitEvent: false });
      priceCtrl.enable({ emitEvent: false });
    } else {
      // On saisit la QUANTITÉ → on verrouille le PRIX
      priceCtrl.disable({ emitEvent: false });
      qtyCtrl.enable({ emitEvent: false });
    }
  }

  recalculate() {
    const { quantity, price, calculateByPrice, product, typeOfSale, contract } = this.clientSaleForm.value;

    if (!product || !typeOfSale) return;

    const selectedProduct = this.products.find(p => p.id === product);
    if (!selectedProduct) return;

    const selectedContract = this.contracts.find(c => c.id === contract);

    // Prix unitaire
    let unitPrice = typeOfSale === 'cleanMoney'
      ? selectedProduct.cleanMoney
      : selectedProduct.dirtyMoney;

    // Appliquer la réduction si cleanMoney + contrat
    if (typeOfSale === 'cleanMoney' && selectedContract) {
      const reduction = selectedContract.reduction ?? 0;
      unitPrice = unitPrice * (1 - reduction / 100);
    }

    if (calculateByPrice) {
      // Prix saisi → calculer la quantité
      if (price && unitPrice) {
        const quantityCalc = Math.floor(price / unitPrice);
        const adjustedPrice = quantityCalc * unitPrice;

        this.clientSaleForm.patchValue(
          { quantity: quantityCalc, price: adjustedPrice },
          { emitEvent: false }
        );
      }
    } else {
      // Quantité saisie → calculer le prix
      if (quantity && unitPrice) {
        const adjustedPrice = Math.floor(quantity * unitPrice);

        this.clientSaleForm.patchValue(
          { price: adjustedPrice },
          { emitEvent: false }
        );
      }
    }
    this.calculated = true;
  }


  loadProducts() {
    this.customerSaleService.getProducts().subscribe(data => this.products = data);
  }

  loadSaleTypes() {
    this.customerSaleService.getSaleTypes().subscribe(data => {
      this.saleTypes = data.map((t: string) => ({
        key: t,
        label: t === 'cleanMoney' ? 'Argent propre' : 'Argent sale'
      }));
    });
  }

  loadContracts() {
    this.customerSaleService.getContracts().subscribe(data => this.contracts = data);
  }

  onSubmit(): void {
    if (this.clientSaleForm.valid) {
      const username = this.auth.getUserInfo()?.username;
      const saleData = { ...this.clientSaleForm.getRawValue(), username };
      this.customerSaleService.createClientSale(saleData).subscribe({
        next: () => {
          alert('Vente ajoutée avec succès');
          this.router.navigate(['/personalDashboard']);
        },
        error: err => console.error('Erreur lors de l’ajout', err)
      });
    }
  }
}
