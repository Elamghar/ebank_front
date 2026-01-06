import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Customer, CustomerUpdateRequest } from '@/model/customer.model';
import { environment } from 'src/environments/environment';



export interface CreateCustomerRequest {
  name: string;
  email: string;
  passwd: string;
  balance:number;
  // phone: string;
  // cin: string;
  // dob: string;
  // address: string;
  // accountType: string;
  // initialBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly baseUrl = 'http://localhost:8085';
  private customerSubject = new BehaviorSubject<Customer | null>(null);
  public customer$ = this.customerSubject.asObservable();

  constructor(private http: HttpClient) {}

  public getCustomers():Observable<Customer[]>{
    return this.http.get<Customer[]>(environment.backendHost+"/customers")
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Adjust based on your auth implementation
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
 get(email: String): any{
    return this.http.get<Customer>(`${this.baseUrl}/customers/`+email, {
      headers: this.getAuthHeaders()
    })
  }
  // Get current customer profile
  getCurrentCustomer(email: String): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/customers/`+email, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(customer => this.customerSubject.next(customer)),
      catchError(this.handleError)
    );
  }

  // Update customer profile
  updateCustomer(customerData: CustomerUpdateRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/customers/`, customerData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(customer => this.customerSubject.next(customer)),
      catchError(this.handleError)
    );
  }
    createCustomer(customerData: CreateCustomerRequest): Observable<any> {
      console.log("helllo :"+customerData.name,customerData.balance,customerData.passwd)
    return this.http.post(environment.backendHost+"/api/create-customer",customerData);
  }
  public deleteCustomer(id: number){
    return this.http.delete(environment.backendHost+"/customers/"+id);
  }
  // Get customer by ID (for admin purposes)
  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/customers/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get current customer from cache
  getCurrentCustomerFromCache(): Customer | null {
    return this.customerSubject.value;
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}

