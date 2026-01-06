import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-agent',
  templateUrl: './sidebar-agent.component.html',
  styleUrls: ['./sidebar-agent.component.css']
})
export class SidebarAgentComponent  {
  menuItems = [
    { icon: 'add', label: 'Nouveau Client', path: '/agent/accueil' },
    { icon: 'settings', label: 'Paramétrage', path: '/agent/parametrage'},
     { icon: 'list', label: 'clients', path: '/agent/clients' },
     { icon: 'wallet', label: 'accounts', path: '/agent/accounts' },
  ];
  constructor(private router :Router) { }
  
  isActive(path: string): boolean {
    return this.router.url === path;
  }

 

}
