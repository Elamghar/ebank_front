import { Account, AccountsService } from '@/services/accounts.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clients-accounts',
  templateUrl: './clients-accounts.component.html',
  styleUrls: ['./clients-accounts.component.css']
})
export class ClientsAccountsComponent implements OnInit {
  accounts: Account[] = [];              // Tous les comptes
  paginatedAccounts: Account[] = [];     // Comptes affichés pour la page courante

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private accountService: AccountsService) {}

  ngOnInit(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.totalPages = Math.ceil(this.accounts.length / this.itemsPerPage);
        this.updatePaginatedAccounts();
      },
      error: (err) => console.error('Erreur chargement comptes', err)
    });
  }

  updatePaginatedAccounts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAccounts = this.accounts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedAccounts();
  }
}