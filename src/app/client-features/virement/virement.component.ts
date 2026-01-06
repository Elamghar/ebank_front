import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransfersService, TransactionRequest, AccountOperation } from '../../services/transfer.service';
import { AuthService } from '@/services/auth.service';
import { AccountsService } from '@/services/accounts.service';
import { BankAccount } from '@/model/account.model';

@Component({
  selector: 'app-virement',
  templateUrl: './virement.component.html',
  styleUrls: ['./virement.component.scss']
})
export class VirementComponent implements OnInit {
  activeTab: 'transfer' | 'history' = 'transfer';
  transferForm: FormGroup;
  isLoading = false;
  operations: AccountOperation[] = [];
  accounts: BankAccount[] = [];

  constructor(
    private fb: FormBuilder,
    private transfersService: TransfersService,
    private accountsService: AccountsService,
    private authService: AuthService
  ) {
  this.transferForm = this.fb.group({
  sourceAccountId: ['', Validators.required],
  destinationAccountId: ['', Validators.required],
  cardType: ['', Validators.required],
  amount: ['', [Validators.required, Validators.min(0.01)]],
  description: ['', Validators.required]
  });

  }

  ngOnInit(): void {
    this.loadAccounts();
    console.log("hello my counts: "+this.accounts);
    this.loadHistory();
  }

loadAccounts(): void {
  const username = this.authService.getUsername();
  const id=this.authService.getId();
  console.log("helllllooooo_ID: "+id);
  this.accountsService.getAccountsByUsername(username).subscribe({
    next: (data) => this.accounts = data,
    error: () => alert('Erreur lors du chargement des comptes.')
  });
}


  loadHistory(): void {
    this.isLoading = true;
    this.transfersService.getHistory().subscribe({
      next: (operations) => {
        this.operations = operations;
        this.isLoading = false;
      },
      error: () => {
        alert('Erreur lors du chargement de l\'historique');
        this.isLoading = false;
      }
    });
  }

  switchTab(tab: 'transfer' | 'history'): void {
    this.activeTab = tab;
  }

  onSubmitTransfer(): void {
    if (this.transferForm.valid) {
      this.isLoading = true;
      const formValue = this.transferForm.value;

      const transactionRequest: TransactionRequest = {
        senderaccountId: formValue.sourceAccountId,
        receiveraccountId: formValue.destinationAccountId,
        // cardType: formValue.cardType,
        amount: formValue.amount,
        description: formValue.description
      };


      this.transfersService.SubmitTransaction(transactionRequest).subscribe({
        next: () => {
          console.log("transaction submited")
          this.transferForm.reset();
          this.isLoading = false;
          alert('Transaction soumise avec succès!');
          this.loadHistory();
          this.activeTab = 'history';
        },
        error: (err) => {
          console.error('Transaction error:', err);
          this.isLoading = false;
          alert('Erreur lors de la soumission de la transaction.');
        }
      });
    } else {
      this.markFormGroupTouched(this.transferForm);
    }
  }

  private ibanValidator(control: any) {
    const iban = control.value?.replace(/\s/g, '');
    if (!iban) return null;

    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
    return ibanRegex.test(iban) ? null : { invalidIban: true };
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['min']) return 'Le montant doit être supérieur à 0';
      if (field.errors['invalidIban']) return 'IBAN invalide';
      if (field.errors['email']) return 'Email invalide';
    }
    return '';
  }

  getOperationTypeClass(type: string): string {
    return type.toLowerCase() === 'debit' ? 'operation-debit' : 'operation-credit';
  }

  getOperationTypeText(type: string): string {
    return type.toLowerCase() === 'debit' ? 'Débit' : 'Crédit';
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
