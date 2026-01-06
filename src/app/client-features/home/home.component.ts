// dashboard-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Remove this line - MatIconModule should be imported in the module
import { MatIconModule } from '@angular/material/icon';
import { CustomerService } from '@/services/customer.service';
import { AuthService } from '@/services/auth.service';
import { Customer } from '@/model/customer.model';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { AccountsService } from '@/services/accounts.service';

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'checking' | 'savings' | 'crypto';
  accountNumber?: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  category?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  customerName: string = 'John Doe';

  accounts: Account[] = [
    {
      id: '1',
      name: 'Compte Courant',
      balance: 8450.75,
      currency: '€',
      type: 'checking',
      accountNumber: '**** 1234',
    },
    {
      id: '2',
      name: 'Livret A',
      balance: 4396.77,
      currency: '€',
      type: 'savings',
      accountNumber: '**** 5678',
    },
    {
      id: '3',
      name: 'Portefeuille Crypto',
      balance: 2847.5,
      currency: '$',
      type: 'crypto',
      accountNumber: '**** 9012',
    },
  ];

  recentTransactions: Transaction[] = [
    {
      id: '1',
      description: 'Virement reçu - Salaire',
      amount: 2800,
      date: '2024-01-15',
      type: 'credit',
      category: 'Salaire',
    },
    {
      id: '2',
      description: 'CB CARREFOUR MARKET',
      amount: -67.45,
      date: '2024-01-14',
      type: 'debit',
      category: 'Alimentation',
    },
    {
      id: '3',
      description: 'Virement vers épargne',
      amount: -500,
      date: '2024-01-13',
      type: 'debit',
      category: 'Épargne',
    },
    {
      id: '4',
      description: 'Remboursement assurance',
      amount: 125.3,
      date: '2024-01-12',
      type: 'credit',
      category: 'Assurance',
    },
    {
      id: '5',
      description: 'Prélèvement EDF',
      amount: -89.2,
      date: '2024-01-11',
      type: 'debit',
      category: 'Factures',
    },
  ];

  quickActions: QuickAction[] = [
    {
      id: '1',
      label: 'Virement',
      icon: 'send',
      route: '/client-dashboard/transfers',
      color: 'primary',
    },
    {
      id: '2',
      label: 'Recharge',
      icon: 'add_circle',
      route: '/client-dashboard/recharges',
      color: 'primary',
    },
    {
      id: '3',
      label: 'Crypto',
      icon: 'currency_bitcoin',
      route: '/client-dashboard/crypto',
      color: 'primary',
    },
    {
      id: '4',
      label: 'Mon Compte',
      icon: 'person',
      route: '/client-dashboard/account',
      color: 'primary',
    },
  ];
  
  constructor(
    private customerService: CustomerService,
    private auth: AuthService,
    private router: Router,
    private accountsserv: AccountsService
  ) {}
  customer!: Customer;
  loading = false;
  saving = false;
  email!: String;
  profileForm!: FormGroup;
  error: string | null = null;
  successMessage: string | null = null;
  balance!:number;
  private loadCustomerData(): void {
  this.loading = true;
  this.error = null;

  this.customerService.getCurrentCustomer(this.email).subscribe({
    next: (custome) => {
      this.customer = custome;
      this.customerName = custome.email;
      console.log('Customer:', custome);
      console.log('Bank Accounts:', custome.bankAccounts);
      if (custome.bankAccounts && custome.bankAccounts.length > 0) {
        console.log('Balance:', custome.bankAccounts[0].balance);
        this.balance=custome.bankAccounts[0].balance
      }
      this.updateFormWithCustomerData(custome);
      this.loading = false;
    },
    error: (error) => {
      this.error = 'Failed to load customer data. Please try again.';
      this.loading = false;
      console.error('Error loading customer:', error);
    },
  });
}

  
  private updateFormWithCustomerData(customer: Customer): void {
    this.profileForm.patchValue({
      name: customer.name,
      email: customer.email,
    });
  }

  ngOnInit(): void {
    this.email = this.auth.getUsername();
    this.loadCustomerData();
 
  }

  getTotalBalance(): number {
    return this.accounts.reduce((total, account) => {
      if (account.currency === '€') {
        return total + account.balance;
      }
      return total + account.balance * 0.85; // Convert other currencies
    }, 0);
  }

  navigateToAccountDetails(accountId: string): void {
    this.router.navigate(['/customer-dashboard/accounts', accountId]);
  }

  navigateToAllTransactions(): void {
    this.router.navigate(['/customer-dashboard/transactions']);
  }

  executeQuickAction(action: QuickAction): void {
    this.router.navigate([action.route]);
  }

  formatAmount(amount: number): string {
    return Math.abs(amount).toFixed(2);
  }

  formatCurrency(amount: number, currency: string): string {
    return `${this.formatAmount(amount)} ${currency}`;
  }

  isPositiveAmount(amount: number): boolean {
    return amount >= 0;
  }

  getTransactionIcon(transaction: Transaction): string {
    return transaction.type === 'credit' ? 'arrow_downward' : 'arrow_upward';
  }

  getAccountTypeIcon(type: string): string {
    switch (type) {
      case 'checking':
        return 'account_balance';
      case 'savings':
        return 'savings';
      case 'crypto':
        return 'currency_bitcoin';
      default:
        return 'account_balance_wallet';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
