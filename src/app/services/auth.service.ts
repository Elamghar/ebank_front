import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

interface User {
  username: string;
  token: string;
  roles?: string[];
  firstName?: string;
  lastName?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private userSubject = new BehaviorSubject<User | null>(
    this.loadUserFromStorage()
  );
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient,private router: Router) {}

  private loadUserFromStorage(): User | null {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          username,
          token,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          roles: payload.roles,
        };
      } catch {
        return null;
      }
    }
    return null;
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${environment.backendHost}/auth/login`, {
        username: email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          this.userSubject.next(response);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  public getUsername(): string {
    return localStorage.getItem('username') || 'Anonymous';
  }
  public getId():string{
    return localStorage.getItem('id')||'anonymous';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.ceil(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles || [];
    } catch {
      return [];
    }
  }
}
