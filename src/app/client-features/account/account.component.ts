import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '@/services/auth.service';
import { AccountsService } from '@/services/accounts.service';
import { Customer, ModifyCustomerRequest } from '@/model/customer.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  customer!: Customer;
  loading = false;
  saving = false;
  email!: string;
  error: string | null = null;
  successMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private accountsService: AccountsService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.email = this.auth.getUsername();
    this.loadCustomerData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCustomerData(): void {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.accountsService
      .getAccountsByUsername(this.email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accounts) => {
          if (accounts.length > 0) {
            this.customer = accounts[0].customer;
            this.updateFormWithCustomerData(this.customer);
          } else {
            this.error = 'Aucun compte trouvé pour cet utilisateur.';
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Impossible de charger les données client. Veuillez réessayer.';
          this.loading = false;
          console.error('Error loading customer:', error);
        },
      });
  }

  private updateFormWithCustomerData(customer: Customer): void {
    this.profileForm.patchValue({
      name: customer.name,
      email: customer.email,
    });
  }

  onSaveChanges(): void {
    if (this.profileForm.valid && !this.saving) {
      this.saving = true;
      this.error = null;
      this.successMessage = null;

      const updateData: ModifyCustomerRequest = {
      name: this.profileForm.value.name,
      email: this.profileForm.value.email,
      passwd: this.profileForm.value.passwd,
      balance: this.profileForm.value.balance,
      phone: this.profileForm.value.phone,
      address: this.profileForm.value.address,
      dateInsc: this.profileForm.value.dateInsc,  // should be in ISO format, e.g., '2025-06-03'
      iban: this.profileForm.value.iban,
      roles: this.profileForm.value.roles,        // array of strings
      cin: this.profileForm.value.cin,
};


      this.accountsService
        .modifyCustomer(updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedCustomer) => {
            this.customer = updatedCustomer;
            this.successMessage = 'Profil mis à jour avec succès !';
            this.saving = false;

            setTimeout(() => (this.successMessage = null), 3000);
          },
          error: (error) => {
            this.error = 'Échec de la mise à jour du profil. Veuillez réessayer.';
            this.saving = false;
            console.error('Error updating customer:', error);
          },
        });
    }
  }

  onRefresh(): void {
    this.loadCustomerData();
  }

  // Helpers for UI
  get totalAccounts(): number {
    return this.customer?.bankAccounts?.length || 0;
  }

  get totalBalance(): number {
    return (
      this.customer?.bankAccounts?.reduce(
        (sum, account) => sum + account.balance,
        0
      ) || 0
    );
  }

  get hasAccounts(): boolean {
    return this.totalAccounts > 0;
  }

  get nameErrors(): string[] {
    const control = this.profileForm.get('name');
    const errors: string[] = [];
    if (control && control.errors && control.touched) {
      if (control.errors['required']) errors.push('Le nom est requis.');
      if (control.errors['minlength']) errors.push('Le nom doit comporter au moins 2 caractères.');
    }
    return errors;
  }

  get emailErrors(): string[] {
    const control = this.profileForm.get('email');
    const errors: string[] = [];
    if (control && control.errors && control.touched) {
      if (control.errors['required']) errors.push('L\'email est requis.');
      if (control.errors['email']) errors.push('Veuillez saisir une adresse email valide.');
    }
    return errors;
  }
}
