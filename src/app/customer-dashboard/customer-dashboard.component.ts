// client-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  accounts: Account[] = [
    { id: '1', name: 'Compte Courant', balance: 8450.75, currency: '€' },
    { id: '2', name: 'Livret A', balance: 4396.77, currency: '€' },
    { id: '3', name: 'Portefeuille Crypto', balance: 2847.50, currency: '$' },
  ];

  recentTransactions: Transaction[] = [
    { id: '1', description: 'Virement reçu - Salaire', amount: 2800, date: '2024-01-15' },
    { id: '2', description: 'CB CARREFOUR MARKET', amount: -67.45, date: '2024-01-14' },
    { id: '3', description: 'Virement vers épargne', amount: -500, date: '2024-01-13' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize component
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
    script.async = true;
    document.head.appendChild(script);
  }

  navigateToTransfers(): void {
    this.router.navigate(['/client/transfers']);
  }

  navigateToRecharges(): void {
    this.router.navigate(['/client/recharges']);
  }

  navigateToCrypto(): void {
    this.router.navigate(['/client/crypto']);
  }

  navigateToAccount(): void {
    this.router.navigate(['/client/account']);
  }

  scrollToChatbot(): void {
    const element = document.getElementById('chatbot');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  formatAmount(amount: number): string {
    return amount.toFixed(2);
  }

  isPositiveAmount(amount: number): boolean {
    return amount >= 0;
  }
}