import { AccountsService, AccountsSummary, TransactionStats } from '@/services/accounts.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface DashboardStats {
  totalAccounts: {
    value: number;
    trend: string;
    trendType: 'positive' | 'negative' | 'neutral';
  };
  accountsByType: {
    value: { [key: string]: number };
    trend: string;
    trendType: 'info';
  };
  totalTransactions: {
    value: number;
    trend: string;
    trendType: 'positive' | 'negative' | 'neutral';
    volume?: number;
    volumeTrend?: string;
  };
  systemStatus: {
    value: string;
    trend: string;
    trendType: 'positive' | 'alert';
  };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {

  stats: DashboardStats = {
    totalAccounts: {
      value: 0,
      trend: 'Chargement...',
      trendType: 'neutral'
    },
    accountsByType: {
      value: {},
      trend: 'Répartition des comptes',
      trendType: 'info'
    },
    totalTransactions: {
      value: 0,
      trend: 'Données en cours de chargement',
      trendType: 'neutral'
    },
    systemStatus: {
      value: 'Opérationnel',
      trend: 'Système fonctionnel',
      trendType: 'positive'
    }
  };

  loading = true;
  error = false;
  errorMessage = '';

  // Helper properties for template
  get accountTypeEntries() {
    return Object.entries(this.stats.accountsByType.value);
  }

  get mostCommonAccountType() {
    const entries = this.accountTypeEntries;
    if (entries.length === 0) return 'N/A';
    
    return entries.reduce((prev, current) => 
      current[1] > prev[1] ? current : prev
    )[0];
  }

  constructor(private accountsService: AccountsService, private router: Router) { }

  ngOnInit(): void {
    this.loadDashboardData();
    
    // Refresh data every 30 seconds
    setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = false;

    forkJoin({
      accountsSummary: this.accountsService.getAccountsSummary().pipe(
        catchError(err => {
          console.error('Error fetching accounts summary:', err);
          return this.createErrorObservable('Erreur lors du chargement des comptes');
        })
      ),
      transactionStats: this.accountsService.getTransactionStats().pipe(
        catchError(err => {
          console.error('Error fetching transaction stats:', err);
          // Return null instead of error to allow partial loading
          return of(null);
        })
      )
    }).subscribe({
      next: (data) => {
        if (data.accountsSummary && !data.accountsSummary.error) {
          // Update stats with accounts data and optional transaction stats
          this.updateStats(data.accountsSummary as AccountsSummary, data.transactionStats as TransactionStats | null);
          this.loading = false;
        } else {
          const errorMsg = data.accountsSummary?.error || 'Erreur inconnue';
          this.handleError(errorMsg);
        }
      },
      error: (err) => {
        this.handleError('Erreur de connexion au serveur');
      }
    });
  }

  private createErrorObservable(message: string): Observable<any> {
    return of({ error: message });
  }

  private updateStats(accountsSummary: AccountsSummary, transactionStats: TransactionStats | null): void {
    // Update total accounts
    this.stats.totalAccounts = {
      value: accountsSummary.totalAccounts,
      trend: this.calculateAccountsTrend(
        accountsSummary.totalAccounts,
        accountsSummary.totalAccountsLastMonth ?? 0
        ),
      trendType: accountsSummary.totalAccounts > 0 ? 'positive' : 'neutral'
    };

    // Update accounts by type
    this.stats.accountsByType = {
      value: accountsSummary.accountsByType,
      trend: `${Object.keys(accountsSummary.accountsByType).length} types de comptes`,
      trendType: 'info'
    };

    // Update transaction data with real statistics or fallback
    if (transactionStats) {
      this.stats.totalTransactions = {
        value: transactionStats.todayTransactions,
        trend: this.formatTransactionTrend(transactionStats.dailyPercentageChange),
        trendType: this.getTrendType(transactionStats.dailyPercentageChange),
        volume: transactionStats.todayVolume,
        volumeTrend: this.formatVolumeTrend(transactionStats.volumePercentageChange)
      };
    } else {
      this.stats.totalTransactions = {
        value: NaN, // ou null, ou -1
        trend: 'Statistiques indisponibles',
        trendType: 'neutral'
      };
    }

    // Update system status
    const transactionInfo = transactionStats ? ` • ${transactionStats.totalTransactions} transactions total` : '';
    this.stats.systemStatus = {
      value: 'Opérationnel',
      trend: `${accountsSummary.totalAccounts} comptes gérés${transactionInfo}`,
      trendType: 'positive'
    };
  }

  private calculateAccountsTrend(totalAccounts: number, totalAccountsLastMonth: number): string {
  if (totalAccountsLastMonth === 0) {
    return "+100% ce mois"; // ou "N/A"
  }
  const growth = ((totalAccounts - totalAccountsLastMonth) / totalAccountsLastMonth) * 100;
  const roundedGrowth = Math.round(growth);
  const sign = growth >= 0 ? "+" : "";
  return `${sign}${roundedGrowth}% ce mois`;
}


  private formatTransactionTrend(percentageChange: number): string {
    const sign = percentageChange >= 0 ? '+' : '';
    return `${sign}${percentageChange.toFixed(1)}% vs hier`;
  }

  private formatVolumeTrend(percentageChange: number): string {
    const sign = percentageChange >= 0 ? '+' : '';
    return `Volume: ${sign}${percentageChange.toFixed(1)}% vs hier`;
  }

  private getTrendType(percentageChange: number): 'positive' | 'negative' | 'neutral' {
    if (percentageChange > 0) return 'positive';
    if (percentageChange < 0) return 'negative';
    return 'neutral';
  }

  private handleError(message: string): void {
    this.error = true;
    this.errorMessage = message;
    this.loading = false;
    console.error('Dashboard error:', message);
  }

  // Method to manually refresh data
  refreshData(): void {
    this.loadDashboardData();
  }

  // Method to get trend color class
  getTrendColorClass(trendType: string): string {
    switch (trendType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'info': return 'text-blue-600';
      case 'alert': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  }

  // Method to get value color class
  getValueColorClass(trendType: string): string {
    switch (trendType) {
      case 'alert': return 'text-red-600';
      default: return 'text-gray-900';
    }
  }



  goToManageAccounts() {
    this.router.navigate(['/admin-dashboard/accounts']);
  }

  goToDailyTransactions() {
    this.router.navigate(['/admin-dashboard/transactions/today']);
  }

  goToReports() {
    this.router.navigate(['/admin-dashboard/reports']);
  }

  goToSettings() {
    this.router.navigate(['/admin-dashboard/parametrage']);
  }
}