import { Component } from '@angular/core';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css']
})
export class RechargeComponent {
  phoneNumber: string = '06 12 34 56 78';
  selectedOperator: string = '';
  selectedAmount: string = '';
  selectedAccount: string = '';
  activeTab: string = 'mobile';

  operators = [
    { value: 'orange', label: 'Orange' },
    { value: 'sfr', label: 'Maroc Telecom' },
    { value: 'bouygues', label: 'Inwi' },
  ];

  amounts = [
    { value: '5', label: '5dh' },
    { value: '10', label: '10dh' },
    { value: '15', label: '15dh' },
    { value: '20', label: '20dh' },
    { value: '25', label: '25dh' },
    { value: '30', label: '30dh' },
    { value: '50', label: '50dh' }
  ];

  accounts = [
    { value: 'compte1', label: 'Compte Courant - **** 1234' },
    { value: 'compte2', label: 'Livret A - **** 5678' },
    { value: 'compte3', label: 'Compte Épargne - **** 9012' }
  ];

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onRecharge() {
    if (this.selectedOperator && this.selectedAmount && this.selectedAccount) {
      alert(`Recharge de ${this.selectedAmount}€ effectuée pour le ${this.phoneNumber}`);
    } else {
      alert('Veuillez remplir tous les champs requis');
    }
  }
}