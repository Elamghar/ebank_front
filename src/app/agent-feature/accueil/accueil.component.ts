import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomerService, CreateCustomerRequest } from '../../services/customer.service';



@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  clientForm!: FormGroup;
  submitted = false;

constructor(
  private fb: FormBuilder,
  private customerService: CustomerService,
  private snackBar: MatSnackBar,
  private router: Router
) {}


  ngOnInit(): void {
    this.clientForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      cin: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      accountType: ['', Validators.required],
      initialBalance: ['', [Validators.required, Validators.min(0)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
  this.submitted = true;

  if (this.clientForm.invalid) {
    this.snackBar.open('Formulaire invalide.', 'Fermer', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    return;
  }

  const clientData: CreateCustomerRequest = {
    name: this.clientForm.value.fullName,
    email: this.clientForm.value.email,
    // phone: this.clientForm.value.phone,
    // cin: this.clientForm.value.cin,
    // dob: this.clientForm.value.dob,
    // address: this.clientForm.value.address,
    // accountType: this.clientForm.value.accountType,
     balance: this.clientForm.value.initialBalance,
    passwd: this.clientForm.value.password
  };
  console.log("helllo zaba :"+clientData.name,clientData.balance,clientData.passwd)

  this.customerService.createCustomer(clientData).subscribe({
    next: () => {
      this.snackBar.open(' Client ajouté avec succès !', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
      this.clientForm.reset();
      this.router.navigate(['/agent/accueil']);
    },
    error: (err) => {
      console.error(err);
      this.snackBar.open('Erreur lors de l\'ajout du client.', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  });
}


}
