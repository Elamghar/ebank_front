import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { CustomerAccountsComponent } from './customer-accounts/customer-accounts.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { VirementComponent } from './client-features/virement/virement.component';
import { CryptoComponent } from './client-features/crypto/crypto.component';
import { HomeComponent } from './client-features/home/home.component';
import { ChatComponent } from './client-features/assistant-ia/chat/chat.component';
import { DashbordComponent } from './admin-features/dashbord/dashbord.component';
import { ParametrageComponent } from './admin-features/parametrage/parametrage.component';
import { DevisesComponent } from './admin-features/devises/devises.component';
import { DailyTransactionsComponent } from './admin-features/daily-transactions/daily-transactions.component';
import { AgentComponent } from './agent/agent.component';
import { ParamAgentComponent } from './agent-feature/parametrage/parametrage.component';
import { AccueilComponent } from './agent-feature/accueil/accueil.component';
import { ClientsComponent } from './agent-feature/clients/clients.component';
import { AccountComponent } from './client-features/account/account.component';
import { RechargeComponent } from './client-features/recharge/recharge.component';
import { ClientsAccountsComponent } from './agent-feature/clients-accounts/clients-accounts.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'agent',
    component: AgentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['CLIENT', 'AGENT'] },
    children: [
      {
        path: 'accueil',
        component: AccueilComponent,
      },
      {
        path: 'parametrage',
        component: ParamAgentComponent,
      },
      {
        path: '',
        redirectTo: 'accueil',
        pathMatch: 'full',
      },
      {
        path: 'clients',
        component: ClientsComponent,
      },
            {
        path: 'accounts',
        component: ClientsAccountsComponent,
      },
    ],
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['CLIENT'] },
  },
  {
    path: 'customer-accounts/:id',
    component: CustomerAccountsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'AGENT', 'CLIENT'] },
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: '',
        component: DashbordComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'devises',
        component: DevisesComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'parametrage',
        component: ParametrageComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'accounts',
        component: AccountsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'transactions/today',
        component: DailyTransactionsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
    ],
  },
  {
    path: 'client-dashboard',
    component: CustomerDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['CLIENT'] },
    children: [
      {
        path: 'transfers',
        component: VirementComponent,
        canActivate: [AuthGuard],
        data: { roles: ['CLIENT'] },
      },
      {
        path: 'crypto',
        component: CryptoComponent,
        canActivate: [AuthGuard],
        data: { roles: ['CLIENT'] },
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { roles: ['CLIENT'] },
      },
      {
        path: 'chat',
        component: ChatComponent,
        canActivate: [AuthGuard],
        data: { roles: ['CLIENT'] },
      },
      {
        path: 'recharges',
        component: RechargeComponent,
        canActivate: [AuthGuard],
        data: { roles: ['CLIENT'] },
      },
      {
        path: 'account',
        component: AccountComponent,
        canActivate: [AuthGuard],
        data: { roles: ['CLIENT'] },
      },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
