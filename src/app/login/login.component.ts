import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const force = this.route.snapshot.queryParamMap.get('force');
    if (this.authService.isLoggedIn() && force !== 'true') {
      const roles = this.authService.getRoles();
      if (roles.includes('AGENT')) {
        this.router.navigate(['/agent']);
      } else if (roles.includes('ADMIN')) {
        this.router.navigate(['/admin-dashboard']);
      } else if (roles.includes('CLIENT')) {
        this.router.navigate(['/client-dashboard/home']);
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          const roles = this.authService.getRoles();
          if (roles.includes('AGENT')) {
            this.router.navigate(['/agent']);
              console.log(roles);
            this.router.navigate(['/accounts']);
          } else if (roles.includes('ADMIN')) {
              console.log(roles);
            this.router.navigate(['/admin-dashboard']);
          } else if (roles.includes('CLIENT')) {
              console.log(roles);
            this.router.navigate(['/customer-dashboard']);
          } else {
            console.log(roles);
            this.errorMessage = 'Invalid role or access denied';
          }
        },
        error: (err) => {
          this.errorMessage = err.message || 'Invalid email or password';
          console.error(err);
        }
      });
    }
  }
}
