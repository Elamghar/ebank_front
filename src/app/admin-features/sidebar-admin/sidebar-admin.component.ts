import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent {
  
  menuItems = [
    { icon: 'home', label: 'Dashboard', path: '/admin-dashboard' },
    { icon: 'settings', label: 'Devises', path: '/admin-dashboard/devises' },
    { icon: 'settings', label: 'Paramétrage', path: '/admin-dashboard/parametrage' }
  ];

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}