// devises/devises.component.ts
import { Component, OnInit } from '@angular/core';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

@Component({
  selector: 'app-devises',
  templateUrl: './devises.component.html',
  styleUrls: ['./devises.component.css']
})
export class DevisesComponent implements OnInit {

  currencies: Currency[] = [
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 1.0 },
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.12 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.85 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 130.45 },
  ];

  newCurrency: Partial<Currency> = {};

  constructor() { }

  ngOnInit(): void {
  }

  addCurrency(): void {
    if (this.newCurrency.code && this.newCurrency.name && 
        this.newCurrency.symbol && this.newCurrency.rate) {
      this.currencies.push(this.newCurrency as Currency);
      this.newCurrency = {};
    }
  }

  deleteCurrency(code: string): void {
    if (code !== 'EUR') { // Prevent deleting EUR base currency
      this.currencies = this.currencies.filter(c => c.code !== code);
    }
  }

  updateRate(code: string, newRate: number): void {
    const currency = this.currencies.find(c => c.code === code);
    if (currency) {
      currency.rate = newRate;
    }
  }

}