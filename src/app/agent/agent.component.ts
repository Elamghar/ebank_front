import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {

  constructor(private router:Router) { }

ngOnInit(): void {
    // Initialize agent dashboard
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Simulate API calls to load dashboard data
    console.log('Loading admin dashboard data...');
  }
  
  navigateToDashboard(): void {
    this.router.navigate(['/accueil']);
  }


}
