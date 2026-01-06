// daily-transactions.component.ts
import { AccountsService } from '@/services/accounts.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-transactions',
  templateUrl: './daily-transactions.component.html',
  styleUrls: ['./daily-transactions.component.css']
})
export class DailyTransactionsComponent implements OnInit {
  transactions: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private accountService: AccountsService) {}

  ngOnInit(): void {
    this.loadTodayTransactions();
  }

  loadTodayTransactions() {
    this.accountService.getTodayTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des transactions';
        this.loading = false;
      }
    });
  }
}
