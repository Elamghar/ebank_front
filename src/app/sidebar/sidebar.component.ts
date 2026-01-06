import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { NgIf, NgForOf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
 menuItems = [
  { icon: 'home', label: 'Accueil', path: '/client-dashboard/home' },
  { icon: 'send', label: 'Virements', path: '/client-dashboard/transfers' },
  { icon: 'credit_card', label: 'Recharges', path: '/client-dashboard/recharges' },
  { icon: 'account_balance_wallet', label: 'Crypto', path: '/client-dashboard/crypto' },
  // { icon: 'chat', label: 'Assistant IA', path: '/client-dashboard/chat' },
  { icon: 'person', label: 'Mon Compte', path: '/client-dashboard/account' },
];


  currentPath = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentPath = event.url;
      });
  }

  isActive(path: string): boolean {
    return this.currentPath.startsWith(path);
  }
}
