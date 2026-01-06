// parametrage/parametrage.component.ts
import { Component, OnInit } from '@angular/core';

export interface SystemSettings {
  maxTransfer: number;
  sessionTimeout: number;
  twoFactorMandatory: boolean;
  maintenanceMode: boolean;
  dailyTransactionLimit: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  auditLogRetention: number;
}

@Component({
  selector: 'app-parametrage',
  templateUrl: './parametrage.component.html',
  styleUrls: ['./parametrage.component.css']
})
export class ParametrageComponent implements OnInit {

  systemSettings: SystemSettings = {
    maxTransfer: 50000,
    sessionTimeout: 30,
    twoFactorMandatory: true,
    maintenanceMode: false,
    dailyTransactionLimit: 100000,
    emailNotifications: true,
    smsNotifications: false,
    auditLogRetention: 90
  };

  // Backup of original settings for reset functionality
  private originalSettings: SystemSettings = { ...this.systemSettings };

  constructor() { }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    // In a real app, this would load from a service/API
    console.log('Loading system settings...');
  }

  saveSettings(): void {
    console.log('Saving settings:', this.systemSettings);
    // In a real app, this would save to a service/API
    this.originalSettings = { ...this.systemSettings };
    // Show success message
    alert('Paramètres sauvegardés avec succès!');
  }

  resetSettings(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres?')) {
      this.systemSettings = { ...this.originalSettings };
    }
  }

  toggleMaintenanceMode(): void {
    if (this.systemSettings.maintenanceMode) {
      if (confirm('Activer le mode maintenance? Cela bloquera l\'accès pour tous les utilisateurs.')) {
        console.log('Maintenance mode activated');
      } else {
        this.systemSettings.maintenanceMode = false;
      }
    }
  }

}