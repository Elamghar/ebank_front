// admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface UserOverview {
  id: string;
  name: string;
  email: string;
  accountType: string;
  totalBalance: number;
  status: 'active' | 'suspended' | 'pending';
}

interface SystemMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  percentage?: number;
}

interface AdminTransaction {
  id: string;
  userId: string;
  userName: string;
  description: string;
  amount: number;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'crypto';
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

interface CurrencyRate {
  currency: string;
  rate: number;
  change: number;
  symbol: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  
  

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize admin dashboard
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Simulate API calls to load dashboard data
    console.log('Loading admin dashboard data...');
  }

  // Navigation methods - matching 3-element sidebar
  navigateToDashboard(): void {
    this.router.navigate(['']);
  }

  navigateToDevises(): void {
    this.router.navigate(['/devises']);
  }

  navigateToParametrage(): void {
    this.router.navigate(['/parametrage']);
  }

  // User management methods
  viewUserDetails(userId: string): void {
    this.router.navigate(['/admin/users', userId]);
  }

  suspendUser(userId: string): void {
    console.log(`Suspending user: ${userId}`);
    // Implement user suspension logic
  }

  activateUser(userId: string): void {
    console.log(`Activating user: ${userId}`);
    // Implement user activation logic
  }

  // Transaction management methods
  viewTransactionDetails(transactionId: string): void {
    this.router.navigate(['/admin/transactions', transactionId]);
  }

  approveTransaction(transactionId: string): void {
    console.log(`Approving transaction: ${transactionId}`);
    // Implement transaction approval logic
  }

  rejectTransaction(transactionId: string): void {
    console.log(`Rejecting transaction: ${transactionId}`);
    // Implement transaction rejection logic
  }

  // Currency management methods (Devises section)
  updateCurrencyRate(currency: string, newRate: number): void {
    console.log(`Updating ${currency} rate to: ${newRate}`);
    // Implement currency rate update logic
  }

  addNewCurrency(): void {
    console.log('Adding new currency...');
    // Navigate to add currency form or open modal
  }

  removeCurrency(currency: string): void {
    console.log(`Removing currency: ${currency}`);
    // Implement currency removal logic
  }

  // System settings methods (Paramétrage section)
  updateSystemSettings(): void {
    console.log('Updating system settings...');
    // Navigate to system settings page
  }

  manageUserRoles(): void {
    console.log('Managing user roles...');
    // Navigate to user roles management
  }

  configureSecuritySettings(): void {
    console.log('Configuring security settings...');
    // Navigate to security configuration
  }

  // Utility methods
  formatAmount(amount: number, currency: string = '€'): string {
    return `${Math.abs(amount).toFixed(2)} ${currency}`;
  }

  formatPercentage(percentage: number): string {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  }

  isPositiveAmount(amount: number): boolean {
    return amount >= 0;
  }

  isPositiveTrend(trend: string): boolean {
    return trend === 'up';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'suspended': return 'status-suspended';
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      default: return 'status-default';
    }
  }

  getTrendClass(trend: string): string {
    switch (trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      case 'stable': return 'trend-stable';
      default: return 'trend-neutral';
    }
  }

  getTransactionTypeIcon(type: string): string {
    switch (type) {
      case 'transfer': return 'send';
      case 'deposit': return 'add';
      case 'withdrawal': return 'remove';
      case 'crypto': return 'currency_bitcoin';
      default: return 'swap_horiz';
    }
  }

  // Dashboard refresh
  refreshDashboard(): void {
    this.loadDashboardData();
    console.log('Dashboard refreshed');
  }

  // Export functionality
  exportTransactions(): void {
    console.log('Exporting transactions...');
    // Implement export logic
  }

  exportUsers(): void {
    console.log('Exporting users...');
    // Implement export logic
  }
}