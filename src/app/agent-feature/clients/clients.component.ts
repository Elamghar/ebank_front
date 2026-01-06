import { Customer } from '@/model/customer.model';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '@/services/customer.service';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: Customer[] = [];
  paginatedClients: Customer[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.clients = data;
        this.totalPages = Math.ceil(this.clients.length / this.itemsPerPage);
        this.updatePaginatedClients();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients', err);
      }
    });
  }

  updatePaginatedClients(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedClients = this.clients.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedClients();
  }
}
