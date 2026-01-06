// // app.module.ts (or your feature module)
// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';

// import { CustomerDashboardComponent } from '@/customer-dashboard/customer-dashboard.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';

// @NgModule({
//   declarations: [
//     CustomerDashboardComponent,
//   ],
//   imports: [
//     BrowserModule,
//     CommonModule,
//     RouterModule.forRoot([
//       { path: 'client/dashboard', component: CustomerDashboardComponent },
//       { path: 'client/transfers', loadChildren: () => import('./modules/transfers/transfers.module').then(m => m.TransfersModule) },
//       { path: 'client/recharges', loadChildren: () => import('./modules/recharges/recharges.module').then(m => m.RechargesModule) },
//       { path: 'client/crypto', loadChildren: () => import('./modules/crypto/crypto.module').then(m => m.CryptoModule) },
//       { path: 'client/account', loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule) },
//       { path: '', redirectTo: '/client/dashboard', pathMatch: 'full' }
//     ])
//   ],
//   providers: [],
//   bootstrap: [CustomerDashboardComponent]
// })
// export class AppModule { }

// // Alternative: Standalone Component (Angular 14+)
// /*
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-client-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './client-dashboard.component.html',
//   styleUrls: ['./client-dashboard.component.scss']
// })
// export class ClientDashboardComponent {
//   // Component logic here
// }
// */

// // Add trackBy functions to the component
// export function trackByAccountId(index: number, account: any): string {
//   return account.id;
// }

// export function trackByTransactionId(index: number, transaction: any): string {
//   return transaction.id;
// }